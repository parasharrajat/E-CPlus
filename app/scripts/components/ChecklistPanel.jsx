import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Box,
    Header,
    IconButton,
    Heading,
    FormControl,
    Checkbox,
    Avatar,
    Button,
} from '@primer/react';
import {
    IterationsIcon,
    MultiSelectIcon,
    XIcon,
} from '@primer/octicons-react';
import _ from 'underscore';
import Checklist from '../lib/Checklist';
import Helper from '../lib/Helper';
import EmptyContent from './EmptyContent';
import checklistAction from '../actions/checklist';
import WithStorage from './WithStorage';
import {STORAGE_KEYS} from '../actions/common';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.any,
    // eslint-disable-next-line react/forbid-prop-types
    checklistData: PropTypes.array,
};

const defaultProps = {
    settings: {
        checklists: [],
        checklistRules: [],
    },
    checklistData: [],
};
class ChecklistPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklists: this.getFreshCheckListData(),
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.checklistData, this.props.checklistData)) {
            this.setState({checklists: this.getFreshCheckListData()});
        }
    }

    getFreshCheckListData() {
        const data = this.props.settings?.checklists
            ?.filter((ck) => Checklist.checklistPageFilter(ck, this.props.settings?.checklistRules))
            .map((ck) => {
                const storedChecklist = this.props.checklistData?.find((storedCk) => storedCk.id === ck.id) || {};

                // Creating a unique prefix for each instance of checklist is necessary to cause the list update when new data is created.
                return {
                    ...ck, html: Checklist.parseChecklistMD(ck.content), ...storedChecklist, prefix: new Date().getTime(),
                };
            });
        return data || [];
    }

    updateChecklist = (item, checked, checklistID) => {
        item.checked = checked;
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({checklists: this.state.checklists});
        const checklist = this.state.checklists?.find((ck) => checklistID === ck.id);
        // eslint-disable-next-line no-restricted-globals
        checklistAction.savePageChecklist(location.href, checklist);
    };

    removeChecklist = (checklistID) => {
        // eslint-disable-next-line no-restricted-globals
        checklistAction.removePageChecklist(location.href, checklistID);
    };

    renderChecklist = (checklistID, checklistItems, level = 1, prefix = undefined) => checklistItems?.map((item, index) => (
        <>
            <FormControl
                id={`checklist_item${prefix}${item.indent}${index}${level}`}
                // eslint-disable-next-line react/no-array-index-key
                key={`checklist_item${prefix}${item.indent}${index}${level}`}
                sx={{
                    py: 1, pl: level * 2, borderWidth: 0, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'border.subtle',
                }}
            >
                <Checkbox
                    defaultChecked={item.checked}
                    onChange={(e) => this.updateChecklist(item, e.target.checked, checklistID)}
                />
                <FormControl.Label sx={{fontWeight: 'normal', fontSize: '12px'}}>{item.content}</FormControl.Label>
            </FormControl>
            {this.renderChecklist(checklistID, item.children, level + 1, `${prefix}${index}${level}`)}
        </>
    ));

    render() {
        return (
            <>
                <Header sx={{
                    px: 3, py: 2, bg: 'canvas.subtle', color: 'fg.default', fontWeight: 'bold',
                }}
                >
                    <Header.Item full>
                        <Avatar square size={34} src={Helper.getAsset('images/checklist.png')} />
                        <Text ml={2} fontSize={3}>
                            Your action list
                        </Text>
                    </Header.Item>
                    <IconButton
                        variant="default"
                        sx={{background: 'transparent'}}
                        icon={XIcon}
                        size="large"
                        onClick={this.props.onClose}
                    />
                </Header>
                <Box pb={3} overflowY="auto" overflowX="hidden" height="100%" flex={1}>
                    {!this.state.checklists.length && (
                        <Box p={3} pb={0} height="100%" textAlign="center">
                            <EmptyContent title="Use this space to track your progress for each task/bug/issue/PR/regression/QA." icon={MultiSelectIcon} />
                        </Box>
                    )}
                    {
                        this.state.checklists.map((checklist, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Fragment key={`checklist_render${index}`}>
                                <Header sx={{
                                    py: 2, px: 3, position: 'sticky', top: 0, zIndex: 1, bg: 'canvas.default', color: 'fg.default',
                                }}
                                >
                                    <Header.Item full>
                                        <Heading
                                            as="h5"
                                            sx={{fontSize: 2}}
                                        >
                                            {checklist.name}
                                        </Heading>
                                    </Header.Item>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        leadingIcon={IterationsIcon}
                                        onClick={() => this.removeChecklist(checklist.id)}
                                    >
                                        Clear
                                    </Button>
                                </Header>

                                <form>
                                    {this.renderChecklist(checklist.id, checklist.html, 1, checklist.prefix)}
                                </form>
                            </Fragment>
                        ))
                    }

                </Box>
            </>
        );
    }
}

ChecklistPanel.propTypes = propTypes;
ChecklistPanel.defaultProps = defaultProps;

export default WithStorage({
    settings: {
        key: STORAGE_KEYS.SETTINGS,
    },
    checklistData: {
        // eslint-disable-next-line no-restricted-globals
        key: `${STORAGE_KEYS.PAGE_CHECKLIST}${location.origin}${location.pathname}`,
    },
})(ChecklistPanel);
