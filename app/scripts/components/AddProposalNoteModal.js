import React, {Component} from "react";
import {addProposalNote} from "../actions/issue";
import {parseCommentURL} from "../actions/common";
import Button from "./Button";
import Modal from "./Modal";

export default class AddProposalNoteModal extends Component {
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
    }

    render() {
        return (
            <Modal title={'Add Note for Proposal'} isVisible={this.props.isVisible} onClose={this.props.onCancel}>
                {this.state.error &&
                    <p className="flash p-2">
                        {this.state.error}
                    </p>
                }
                <form onSubmit={this.submitForm} data-turbo="false">
                    <dl className="form-group">
                        <dt><label>Proposal Link</label></dt>
                        <dd><input readOnly className="form-control" type="text" value={this.props.proposalLink} /></dd>
                    </dl>
                    <dl className="form-group">
                        <dt><label>Note</label></dt>
                        <dd><textarea name="note-text" className="form-control js-paste-markdown" onChange={this.saveNote}></textarea></dd>
                    </dl>
                    <div className="d-flex d-sm-block">
                        <button type="submit" data-view-component="true" className="btn-primary btn"> Save Note</button>
                    </div>
                </form>
            </Modal>
        );
    }
}
