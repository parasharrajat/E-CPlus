import helper from '../lib/helper';
import Navigation from '../lib/Navigation';

function hideComment(element) {
    // eslint-disable-next-line no-param-reassign
    element.hidden = true;
    element.classList.add('ecp-hide-comment');
}
function showComment(element) {
    // eslint-disable-next-line no-param-reassign
    element.hidden = false;
    element.classList.remove('ecp-hide-comment');
}

function hideExtraComments() {
    document.querySelectorAll('.js-discussion .TimelineItem').forEach((node) => {
        // If Comment is the issue body skip
        if (node.closest('.js-command-palette-issue-body')) {
            return;
        }

        const contentNode = node.querySelector('.TimelineItem-body');
        const isCommentNode = contentNode.closest('.js-comment-container');

        if (isCommentNode && helper.isCommentProposal(contentNode)) {
            return;
        }

        if (isCommentNode && helper.isAutoAssignmentComment(contentNode)) {
            return;
        }

        if (isCommentNode && helper.isProposalArrovedComment(contentNode)) {
            return;
        }

        if (isCommentNode && helper.isUserAssignedComment(contentNode)) {
            return;
        }

        if (contentNode.textContent.includes('changed the title')) {
            return;
        }

        hideComment(node);
    });
}

function loadAllComments(parent) {
    const paginationContainer = parent.querySelector('#js-progressive-timeline-item-container');
    if (!paginationContainer) {
        return Promise.resolve();
    }
    return Navigation.triggerCommentsPagination(paginationContainer).then(() => {
        hideExtraComments();
        return loadAllComments(paginationContainer);
    });
}

function on() {
    loadAllComments(document);
    hideExtraComments();
}
function off() {
    document.querySelectorAll('.js-discussion .ecp-hide-comment').forEach((node) => {
        showComment(node);
    });
}
export default {on, off};
