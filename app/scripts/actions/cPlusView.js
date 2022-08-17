import helper from '../lib/helper';

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

function loadAllComments() {
    const paginationNodes = document.querySelectorAll('.js-ajax-pagination.pagination-loader-container');
    paginationNodes.forEach((node) => {
        const triggerButton = node.querySelector('button.ajax-pagination-btn');
        triggerButton.click();
    });
    if (paginationNodes.length) {
        loadAllComments();
    }
}

function on() {
    loadAllComments();
    hideExtraComments();
}
function off() {
    document.querySelectorAll('.js-discussion .ecp-hide-comment').forEach((node) => {
        showComment(node);
    });
}
export default {on, off};
