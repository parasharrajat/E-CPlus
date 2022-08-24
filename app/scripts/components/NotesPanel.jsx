import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Box,
    Header,
    IconButton,
    ActionList,
    Label,
    CircleBadge,
    Avatar,
    FormControl,
    TextInputWithTokens,
    TextInput,
} from '@primer/react';
import {
    XIcon,
    ArrowRightIcon,
    TrashIcon,
    CheckCircleFillIcon,
    SearchIcon,
} from '@primer/octicons-react';
import WithStorage from './WithStorage';
import {NOTE_TYPE, parseCommentURL, STORAGE_KEYS} from '../actions/common';
import TitleLoader from './TitleLoader';
import {removeProposalNote} from '../actions/issue';
import Helper from '../lib/Helper';
import EmptyContent from './EmptyContent';
import NoteEnlargeView from './NoteEnlargeView';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    notes: PropTypes.arrayOf(PropTypes.any),
};

const defaultProps = {
    notes: [],
};
class NotesPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: [],
        };
    }

    searchNotes = (notes, input) => notes.filter((n) => new RegExp(input, 'gi').test(`${n.note} ${n.issue} ${n.userHandle} ${this.getNoteTag(n.noteType)}`));

    getNoteTag = (noteType) => {
        // eslint-disable-next-line default-case
        switch (noteType) {
            case NOTE_TYPE.ISSUE: return 'Main';
            case NOTE_TYPE.PROPOSAL: return 'Proposal Note';
            default: return 'Proposal Note';
        }
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    showEnlargeView = (note) => {
        this.setState({isEnlargeViewVisible: true, noteUrl: note.link});
    };

    hideEnlargeView = () => {
        this.setState({isEnlargeViewVisible: false, noteUrl: ''});
    };

    render() {
        const notes = this.searchNotes(this.props.notes, this.state.searchText);
        return (
            <>
                <Header sx={{
                    px: 3, py: 2, bg: 'canvas.subtle', color: 'fg.default', fontWeight: 'bold',
                }}
                >
                    <Header.Item full hidden={this.state.isSearchFocused}>
                        <Avatar square size={34} src={Helper.getAsset('images/notes.png')} />
                        <Text ml={2} fontSize={3}>
                            Notes
                        </Text>
                    </Header.Item>
                    <Header.Item full={this.state.isSearchFocused}>
                        <FormControl sx={{width: '100%'}}>
                            <FormControl.Label visuallyHidden>Tokens</FormControl.Label>
                            <TextInputWithTokens
                                block
                                onFocus={() => this.setState({isSearchFocused: true})}
                                sx={{
                                    borderRadius: 3,
                                }}
                                onInput={(e) => this.setState({searchText: e.target.value})}
                                leadingVisual={SearchIcon}
                                trailingAction={this.state.searchText ? (
                                    <TextInput.Action
                                        onClick={() => this.setState({searchText: ''})}
                                        icon={XIcon}
                                        aria-label="Clear input"
                                        sx={{color: 'fg.subtle'}}
                                    />
                                ) : undefined}
                                tokens={this.state.tokens}
                                onBlur={() => this.setState({isSearchFocused: false})}
                            />
                        </FormControl>
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
                    {!notes.length && (
                        <EmptyContent title="Looks like you are all clear on your doubts." icon={CheckCircleFillIcon} />
                    )}
                    {notes.map((note, index) => (
                        <Box
                            // eslint-disable-next-line react/no-array-index-key
                            key={`note_${index}`}
                            bg="canvas.subtle"
                            boxShadow="shadow.small"
                            borderWidth={1}
                            borderStyle="solid"
                            borderColor="border.subtle"
                            sx={{
                                ':hover': {
                                    boxShadow: 'shadow.medium',
                                },
                            }}
                            borderRadius={2}
                            className="notespanel-note"
                            mb={3}
                            position="relative"
                        >
                            <ActionList.LinkItem
                                sx={{width: 'auto', position: 'relative'}}
                                href={note.link}
                            >
                                <Text fontSize="small" sx={{float: 'right'}}>
                                    {'# '}
                                    {this.getNoteTag(note.noteType)}
                                </Text>
                                <ActionList.Description
                                    variant="block"
                                    sx={{fontWeight: 'bold'}}
                                >
                                    <TitleLoader link={note.link}>{(title) => title}</TitleLoader>
                                </ActionList.Description>
                                <CircleBadge
                                    sx={{backgroundColor: 'palevioletred'}}
                                    variant="small"
                                    size={32}
                                    className="icon-go"
                                >
                                    <CircleBadge.Icon icon={ArrowRightIcon} />
                                </CircleBadge>
                            </ActionList.LinkItem>
                            <Box px={2} flexDirection="row" display="flex">
                                {!!note.userHandle
                                 && (
                                     <Label>
                                         <Avatar src={note.userAvatar} size={16} sx={{mr: 1}} />
                                         {'  '}
                                         {note.userHandle}
                                     </Label>
                                 )}

                                <Label sx={{ml: 1}}>
                                    #
                                    {parseCommentURL(note.link).issueID}
                                </Label>
                            </Box>
                            <Box py={2} px={3}>
                                {note.note}
                            </Box>
                            {/* Not yet ready to add this. */}
                            {/* <IconButton
                                icon={ScreenFullIcon}
                                onClick={() => this.showEnlargeView(note)}
                                sx={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 46,
                                }}
                            /> */}
                            <IconButton
                                aria-label="remove"
                                variant="danger"
                                icon={TrashIcon}
                                onClick={() => removeProposalNote(note)}
                                sx={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 2,
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                <NoteEnlargeView isVisible={this.state.isEnlargeViewVisible} noteUrl={this.state.noteUrl} onCancel={this.hideEnlargeView} />
            </>
        );
    }
}

NotesPanel.propTypes = propTypes;
NotesPanel.defaultProps = defaultProps;

export default WithStorage({
    notes: {
        key: STORAGE_KEYS.NOTE,
    },
})(NotesPanel);
