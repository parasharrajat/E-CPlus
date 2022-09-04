import React, {Component} from 'react';
import {
    Dialog, Box, FormControl, TextInput, Textarea, Button, Flash,
} from '@primer/react';
import {
    any, bool, func, string,
} from 'prop-types';
import {saveNote} from '../actions/issue';
import {parseCommentURL, STORAGE_KEYS} from '../actions/common';
import WithStorage from './WithStorage';

const propTypes = {
    onCancel: func.isRequired,
    isVisible: bool,
    proposalLink: string,
    userHandle: string,
    userAvatar: string,
    noteType: string,
    title: string,
    // eslint-disable-next-line react/forbid-prop-types
    note: any,
};

const defaultProps = {
    note: {},
    isVisible: false,
    proposalLink: '',
    userHandle: '',
    userAvatar: '',
    noteType: '',
    title: 'Add Note for Proposal',
};
class AddNoteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: '',
            error: '',
        };
        this.saveNote = this.saveNote.bind(this);
        this.clearError = this.clearError.bind(this);
    }

    submitForm = (e) => {
        e.preventDefault();
        if (!this.state.note.trim()) {
            this.setState({error: 'You need to add a note to save it.'});
            return;
        }
        this.clearError();
        const {issueID, commentID} = parseCommentURL(this.props.proposalLink);
        saveNote(commentID, issueID, this.props.proposalLink, this.state.note, this.props.userHandle, this.props.userAvatar, this.props.noteType);
        this.props.onCancel();
    };

    clearError() {
        this.setState({error: ''});
    }

    saveNote(e) {
        this.setState({note: e.target.value});
        this.clearError();
    }

    render() {
        console.debug(this.props);
        return (
            <Dialog
                isOpen={this.props.isVisible}
                onDismiss={this.props.onCancel}
                sx={{
                    margin: 0,
                    transform: 'translate3d(-50%, -50%, 0)',
                    top: '50%',
                }}
            >
                <Dialog.Header>{this.props.title}</Dialog.Header>
                {this.state.error
                    && (
                        <Flash
                            sx={{
                                borderRadius: 0, width: '100%', m: 0, p: 2,
                            }}
                            variant="danger"
                        >
                            {this.state.error}
                        </Flash>
                    )}
                <Box p={3}>
                    <form onSubmit={this.submitForm}>
                        <FormControl>
                            <FormControl.Label>Note Link</FormControl.Label>
                            <TextInput
                                width="100%"
                                readOnly
                                value={this.props.proposalLink}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Note</FormControl.Label>
                            <Textarea
                                block
                                resize="vertical"
                                defaultValue={this.props.note?.note}
                                onChange={this.saveNote}
                            />
                        </FormControl>
                        <Button type="submit" variant="primary" sx={{mt: 2}}>Save Note</Button>
                    </form>
                </Box>
            </Dialog>
        );
    }
}

AddNoteModal.propTypes = propTypes;
AddNoteModal.defaultProps = defaultProps;

export default WithStorage({
    note: {
        key: ({proposalLink}) => {
            if (!proposalLink) {
                return;
            }
            const {issueID, commentID} = parseCommentURL(proposalLink);

            if (commentID) {
                return `${STORAGE_KEYS.NOTE}${issueID}_${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`;
            }
            return `${STORAGE_KEYS.NOTE}${issueID}_issue`;
        },
    },
})(AddNoteModal);
