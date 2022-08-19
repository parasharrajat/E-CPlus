import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Box,
    Header,
    IconButton,
    ActionList,
    Heading,
    Avatar,
    Button,
} from '@primer/react';
import {
    XIcon,
    TrashIcon,
    PlusIcon,
    FoldDownIcon,
} from '@primer/octicons-react';
import WithStorage from './WithStorage';
import {STORAGE_KEYS} from '../actions/common';
import ChecklistForm from './ChecklistForm';
import settings from '../actions/settings';
import helper from '../lib/helper';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.any,
};

const defaultProps = {
    settings: {},
};
class SeetingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    showCheckListForm = (id) => {
        this.setState({isChecklistFormVisible: true, selectedChecklist: id});
    };

    hideCheckListForm = () => {
        this.setState({isChecklistFormVisible: false, selectedChecklist: null});
    };

    removeCheckList = (e, id) => {
        e.stopPropagation();
        settings.removeChecklist(id);
    };

    render() {
        return (
            <>
                <Header sx={{
                    px: 3, py: 2, bg: 'canvas.subtle', color: 'fg.default', fontWeight: 'bold',
                }}
                >
                    <Header.Item full>
                        <Avatar square size={34} src={helper.getAsset('images/settings.png')} />
                        <Text ml={2} fontSize={3}>
                            Settings
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
                <Box p={3} overflowY="auto" overflowX="hidden" height="100%" flex={1}>
                    <Heading as="h5" sx={{fontSize: 2}}>
                        Checklist Settings
                    </Heading>
                    <ActionList showDividers>
                        {this.props.settings.checklists?.map((checklist, index) => (
                            <>
                                {(!this.state.isChecklistFormVisible || (this.state.isChecklistFormVisible && this.state.selectedChecklist !== checklist.id)) && (
                                    <ActionList.Item
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={`checklist_${index}`}
                                        sx={{m: 0, width: '100%'}}
                                        onSelect={() => this.showCheckListForm(checklist.id)}
                                    >
                                        {checklist.name}
                                        <ActionList.LeadingVisual>
                                            <FoldDownIcon size={16} />
                                        </ActionList.LeadingVisual>
                                        <ActionList.TrailingVisual>
                                            <IconButton size={16} icon={TrashIcon} variant="danger" sx={{py: 0}} onClick={(e) => this.removeCheckList(e, checklist.id)} />
                                        </ActionList.TrailingVisual>
                                    </ActionList.Item>
                                )}
                                {this.state.isChecklistFormVisible && this.state.selectedChecklist === checklist.id && (
                                    <ChecklistForm
                                        checklist={checklist}
                                        hideCheckListForm={this.hideCheckListForm}
                                    />
                                )}
                            </>
                        ))}
                        {!this.state.isChecklistFormVisible && (
                            <>
                                <ActionList.Divider />
                                <ActionList.Item
                                    sx={{textAlign: 'center', mt: 2, p: 0}}
                                    onSelect={() => this.showCheckListForm()}
                                >
                                    <Button sx={{width: '100%', display: 'flex', justifyContent: 'center'}} leadingIcon={PlusIcon}> Add new</Button>
                                </ActionList.Item>
                            </>
                        )}
                        {this.state.isChecklistFormVisible && !this.state.selectedChecklist && (
                            <ChecklistForm
                                checklist={{}}
                                hideCheckListForm={this.hideCheckListForm}
                            />
                        )}
                    </ActionList>
                </Box>
            </>
        );
    }
}

SeetingsPage.propTypes = propTypes;
SeetingsPage.defaultProps = defaultProps;

export default WithStorage({
    settings: {
        key: STORAGE_KEYS.SETTINGS,
    },
})(SeetingsPage);
