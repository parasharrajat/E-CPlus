import Browser from 'webextension-polyfill';

export function sendDataToBG(data) {
    return Browser.runtime.sendMessage(data);
}

export const ISSUE_SUBSCRIPTION = {
    PAYMENT: 1,
    TIMELINE: 2,
    PR: 3,
};

export const STORAGE_KEYS = {
    NOTE: 'note_',
    PROPOSAL_COMMENT: 'proposal_comment_',
};

export function parseCommentURL(url) {
    const [, issueID, commentID] = /https\:\/\/github\.com\/[^\/]*\/[^\/]*\/issues\/(\d*)\#issuecomment\-(\d*)/.exec(url);
    return {
        issueID,
        commentID,
    };
}
