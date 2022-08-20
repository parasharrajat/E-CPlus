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
    FormControl,
    SelectPanel,
} from '@primer/react';
import {
    XIcon,
    TrashIcon,
    PlusIcon,
    FoldDownIcon,
    TriangleDownIcon,
} from '@primer/octicons-react';
import _ from 'underscore';
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
        this.state = {
            pageTypes: [
                this.createPageType('issues', 'Issues', '/issues'),
                this.createPageType('pr', 'Pull Request', '/pull'),
            ],
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.settings.checklists, this.props.settings.checklists)) {
            this.setState({
                pageTypes: [
                    this.createPageType('issues', 'Issues', '/issues'),
                    this.createPageType('pr', 'Pull Request', '/pull'),
                ],
            });
        }
    }

    createPageType = (id, title, url) => {
        const items = this.getItems('');
        const savedItems = this.getSavedRule(id);
        const selected = items.filter((item) => savedItems.find((it) => it.id === item.id));
        return {
            id,
            title,
            url,
            selected,
            filter: '',
            isOpen: false,
            checklists: items,
        };
    };

    updatePageCheckLists = (index, field, value) => {
        this.setState((prevState) => {
            // eslint-disable-next-line no-param-reassign
            prevState.pageTypes[index] = {...prevState.pageTypes[index], [field]: value};
            return {
                pageTypes: prevState.pageTypes,
            };
        }, () => {
            if (field === 'selected') {
                settings.updateChecklistRules(this.state.pageTypes.map((pT) => ({
                    id: pT.id, url: pT.url, title: pT.title, selected: pT.selected,
                })));
            }
        });
    };

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

    getItems = (filter) => this.props.settings.checklists
        .map((ck) => ({id: ck.id, text: ck.name}))
        .filter((ck) => !filter || !filter.trim() || ck.text.toLowerCase().startsWith(filter.toLowerCase()));

    getSavedRule = (ruleId) => {
        const checklistRule = this.props.settings?.checklistRules?.find((ck) => ck.id === ruleId);
        return checklistRule.selected || [];
    };

    render() {
        console.debug(this.state.pageTypes);
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
                    <Heading as="h5" sx={{fontSize: 2, mt: 3}}>
                        Checklist Rendering Rules
                    </Heading>
                    {this.state.pageTypes.map((type, index) => (
                        <FormControl sx={{
                            py: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        }}
                        >
                            <FormControl.Label sx={{alignSelf: 'center'}}>{type.title}</FormControl.Label>
                            <SelectPanel
                                // eslint-disable-next-line react/no-array-index-key
                                key={`checklist_rule_${index}`}
                                renderAnchor={({children, ...anchorProps}) => (
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    <Button trailingIcon={TriangleDownIcon} {...anchorProps} sx={{m: 0}}>
                                        {children || 'Select Checklists'}
                                    </Button>
                                )}
                                placeholderText="Filter Labels"
                                open={type.isOpen}
                                onOpenChange={(state) => this.updatePageCheckLists(index, 'isOpen', state)}
                                items={type.checklists.filter((ck) => !type.filter || !type.filter.trim() || ck.text.toLowerCase().startsWith(type.filter.toLowerCase()))}
                                selected={type.selected}
                                onSelectedChange={(value) => this.updatePageCheckLists(index, 'selected', value)}
                                onFilterChange={(filter) => this.updatePageCheckLists(index, 'filter', filter)}
                                showItemDividers
                                overlayProps={{width: 'small', height: 'xsmall', sx: {zIndex: 100000000000002}}}
                            />
                        </FormControl>

                    ))}
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
