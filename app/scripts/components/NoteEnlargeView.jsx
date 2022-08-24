import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    Dialog,
    Box,
    Text,
    IconButton,
    Label,
    Avatar,
} from '@primer/react';
import {TrashIcon} from '@primer/octicons-react';
import {any, bool, func} from 'prop-types';
import {NOTE_TYPE, parseCommentURL, STORAGE_KEYS} from '../actions/common';
import WithStorage from './WithStorage';
import TitleLoader from './TitleLoader';
import {removeProposalNote} from '../actions/issue';

const propTypes = {
    onCancel: func.isRequired,
    isVisible: bool,
    // eslint-disable-next-line react/forbid-prop-types
    note: any,
};

const defaultProps = {
    note: {
        link: '',
        noteType: '',
        userAvatar: null,
        userHandle: null,
    },
    isVisible: false,
};
class NoteEnlargeView extends Component {
    getNoteTag = (noteType) => {
    // eslint-disable-next-line default-case
        switch (noteType) {
            case NOTE_TYPE.ISSUE:
                return 'Main';
            case NOTE_TYPE.PROPOSAL:
                return 'Proposal Note';
            default:
                return 'Proposal Note';
        }
    };

    render() {
        return ReactDOM.createPortal(
            <Dialog isOpen={this.props.isVisible} onDismiss={this.props.onCancel}>
                <Dialog.Header>
                    {/* <ActionList.LinkItem
                        sx={{width: 'auto', position: 'relative'}}
                        href={this.props.note.link}
                    > */}
                    <Text fontSize="small" sx={{float: 'right'}}>
                        {'# '}
                        {this.getNoteTag(this.props.note.noteType)}
                    </Text>
                    {/* <ActionList.Description variant="block" sx={{fontWeight: 'bold'}}>

                        </ActionList.Description>
                    </ActionList.LinkItem> */}
                </Dialog.Header>
                <TitleLoader link={this.props.note.link}>
                    {(title) => title || null}
                </TitleLoader>
                <Box px={2} flexDirection="row" display="flex">
                    {!!this.props.note.userHandle && (
                        <Label>
                            <Avatar
                                src={this.props.note.userAvatar}
                                size={16}
                                sx={{mr: 1}}
                            />
                            {'  '}
                            {this.props.note.userHandle}
                        </Label>
                    )}

                    <Label sx={{ml: 1}}>
                        #
                        {parseCommentURL(this.props.note.link)?.issueID}
                    </Label>
                </Box>
                <Box py={2} px={3}>
                    {this.props.note.note}
                </Box>
                <IconButton
                    aria-label="remove"
                    variant="danger"
                    icon={TrashIcon}
                    onClick={() => removeProposalNote(this.props.note)}
                    sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                    }}
                />
            </Dialog>,
            document.querySelector('body'),
        );
    }
}

NoteEnlargeView.propTypes = propTypes;
NoteEnlargeView.defaultProps = defaultProps;

export default WithStorage({
    note: {
        key: ({noteUrl}) => {
            if (!noteUrl) {
                return;
            }
            const {issueID, commentID} = parseCommentURL(noteUrl);

            if (commentID) {
                return `${STORAGE_KEYS.NOTE}${issueID}_${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`;
            }
            return `${STORAGE_KEYS.NOTE}${issueID}_issue`;
        },
    },
})(NoteEnlargeView);
