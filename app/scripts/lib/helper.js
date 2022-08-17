const urlCache = {};

async function getGhTitle(link) {
    if (urlCache[link]) {
        return urlCache[link];
    }
    const response = await fetch(link);
    if (!response.ok) {
        return '';
    }
    const body = await response.text();
    const parser = new DOMParser();
    const DOM = parser.parseFromString(body, 'text/html');
    const title = DOM.querySelector('head > title')?.innerHTML;
    urlCache[link] = title;
    return title;
}

function isCommentProposal(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().match(/^proposal/gi);
    }
}

function isAutoAssignmentComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().toLowerCase().includes('triggered auto assignment');
    }
}

function isUserAssignedComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().toLowerCase().includes('you have been assigned to this job');
    }
}

function isProposalArrovedComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (!contentNode) {
        return;
    }
    const hasEmojies = Array.from(contentNode.querySelectorAll('g-emoji')).reduce((final, emojiNode) => final + emojiNode.getAttribute('alias'), '') === 'ribboneyesribbon';
    return hasEmojies && contentNode.textContent.trim().toLowerCase().includes('c+ reviewed');
}

export default {
    getGhTitle, isCommentProposal, isAutoAssignmentComment, isProposalArrovedComment, isUserAssignedComment,
};
