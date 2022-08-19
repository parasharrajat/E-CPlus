import React, {Component} from 'react';
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
} from '@primer/react';
import {
    MultiSelectIcon,
    XIcon,
} from '@primer/octicons-react';
import Checklist from '../lib/Checklist';
import helper from '../lib/helper';
import EmptyContent from './EmptyContent';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    checklists: PropTypes.any,
};

const defaultProps = {
    checklists: [],
};
class ChecklistPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklists: props.checklists.map((ck) => ({...ck, html: Checklist.parseChecklistMD(ck.content)})),
        };
    }

    renderChecklist = (checklist, level = 1, prefix = undefined) => checklist?.map((item, index) => (
        <>
            <FormControl
                // eslint-disable-next-line react/no-array-index-key
                key={`checklist_item${prefix}${index}`}
                sx={{
                    py: 1, pl: level + 1, borderWidth: 0, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'border.subtle',
                }}
            >
                <Checkbox
                    id={`checklist_item${prefix}${index}`}
                    // eslint-disable-next-line no-param-reassign
                    onChange={(e) => item.checked = e.target.checked}
                />
                <FormControl.Label sx={{fontWeight: 'normal', fontSize: '12px'}}>{item.content}</FormControl.Label>
            </FormControl>
            {this.renderChecklist(item.children, 2, `child${prefix}`)}
        </>
    ));

    render() {
        console.debug(this.state);
        return (
            <>
                <Header sx={{
                    px: 3, py: 2, bg: 'canvas.subtle', color: 'fg.default', fontWeight: 'bold',
                }}
                >
                    <Header.Item full>
                        <Avatar square size={34} src={helper.getAsset('images/checklist.png')} />
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
                            <>
                                <Heading
                                    as="h5"
                                    sx={{
                                        fontSize: 2, py: 2, px: 3, position: 'sticky', top: 0, zIndex: 1, bg: 'canvas.default',
                                    }}
                                >
                                    {checklist.name}
                                </Heading>
                                <form>
                                    {this.renderChecklist(checklist.html, 1, index)}
                                </form>
                            </>
                        ))
                    }

                </Box>
            </>
        );
    }
}

ChecklistPanel.propTypes = propTypes;
ChecklistPanel.defaultProps = defaultProps;

export default (ChecklistPanel);
