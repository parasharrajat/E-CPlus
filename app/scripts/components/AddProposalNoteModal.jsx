import React, {Component} from 'react';
import {Dialog, Box} from '@primer/react';
import {addProposalNote} from '../actions/issue';
import {parseCommentURL, STORAGE_KEYS} from '../actions/common';
import WithStorage from './WithStorage';

class AddProposalNoteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: '',
            error: '',
        };
        this.saveNote = this.saveNote.bind(this);
        this.clearError = this.clearError.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    saveNote(e) {
        this.setState({note: e.target.value});
        this.clearError();
    }

    clearError() {
        this.setState({error: ''});
    }

    submitForm = (e) => {
        e.preventDefault();
        if (!this.state.note.trim()) {
            this.setState({error: 'You need to add a note to save it.'});
            return;
        }
        this.clearError();
        const {issueID, commentID} = parseCommentURL(this.props.proposalLink);
        addProposalNote(commentID, issueID, this.props.proposalLink, this.state.note);
        this.props.onCancel();
    };

    render() {
        return (
            <Dialog
                isOpen={this.props.isVisible}
                onDismiss={this.props.onCancel}
            >
                <Dialog.Header>Add Note for Proposal</Dialog.Header>
                {this.state.error
                    && (
                        <p className="flash p-2">
                            {this.state.error}
                        </p>
                    )}
                <Box p={3}>
                    <form onSubmit={this.submitForm} data-turbo="false">
                        <dl className="form-group">
                            <dt><label>Proposal Link</label></dt>
                            <dd><input readOnly className="form-control" type="text" value={this.props.proposalLink} /></dd>
                        </dl>
                        <dl className="form-group">
                            <dt><label>Note</label></dt>
                            <dd><textarea name="note-text" className="form-control js-paste-markdown" value={this.props.note?.note} onChange={this.saveNote} /></dd>
                        </dl>
                        <div className="d-flex d-sm-block">
                            <button type="submit" data-view-component="true" className="btn-primary btn"> Save Note</button>
                        </div>
                    </form>
                </Box>
            </Dialog>
        );
    }
}

export default WithStorage({
    note: {
        key: ({proposalLink}) => {
            if (!proposalLink) {
                return;
            }
            const {issueID, commentID} = parseCommentURL(proposalLink);
            return `${STORAGE_KEYS.NOTE}${issueID}_${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`;
        },
    },
})(AddProposalNoteModal);
