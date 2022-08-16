import {Button, ActionMenu, ActionList} from '@primer/react';
import React, {Component} from 'react';
import {FileAddedIcon, EyeIcon} from '@primer/octicons-react';
import {markProposalReviewed as markProposalReviewedAction} from '../actions/issue';
import {parseCommentURL, STORAGE_KEYS} from '../actions/common';
import proposalNoteModal from '../lib/proposalNoteModal';
import WithStorage from './WithStorage';

class ProposalActions extends Component {
    markProposalReviewed = (e) => {
        const issueNode = e.target.closest('[id^=issuecomment-]');
        const timeNode = issueNode.querySelector('.timeline-comment-header-text .js-timestamp');
        markProposalReviewedAction(parseCommentURL(timeNode.href).commentID);
    };

    addNoteforProposal = (e) => {
        const issueNode = e.target.closest('[id^=issuecomment-]');

        // '.timeline-comment-header-text .js-timestamp' was old selection for link
        const timeNode = issueNode.querySelector(`#${issueNode.id}-permalink` || '.timeline-comment-header-text .js-timestamp');
        proposalNoteModal.show(timeNode.href);
    };

    render() {
        return (
            <div className="flex-items-center flex-auto d-flex">
                <Button sx={{ml: 2}} leadingIcon={FileAddedIcon} size="small" onClick={this.addNoteforProposal}>Add Note</Button>
                <ActionMenu>
                    <ActionMenu.Button size="small" sx={{ml: 2}}>More</ActionMenu.Button>
                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item onSelect={this.markProposalReviewed}>
                                <ActionList.LeadingVisual>
                                    <EyeIcon size={16} />
                                </ActionList.LeadingVisual>
                                Mark Reviewed
                                <ActionList.Description variant="block">Reviewed this proposal. Check this to keep track of it.</ActionList.Description>
                            </ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </div>
        );
    }
}

export default ProposalActions;
