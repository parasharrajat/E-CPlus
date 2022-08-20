import browser from 'webextension-polyfill';

export function sendDataToBG(data) {
    return browser.runtime.sendMessage(data);
}
export const BROWSER_EXTENSION_ID = browser.runtime.id;

export const ISSUE_SUBSCRIPTION = {
    PAYMENT: 1,
    TIMELINE: 2,
    PR: 3,
};

export const NOTE_TYPE = {
    PROPOSAL: 'proposal',
};

export const STORAGE_KEYS = {
    NOTE: 'note_',
    PROPOSAL_COMMENT: 'proposal_comment_',
    SETTINGS: 'settings_',
    PAGE_CHECKLIST: 'page_checklist',
};

export function parseCommentURL(url) {
    // eslint-disable-next-line no-useless-escape
    const [, pageType, id, commentID] = /https\:\/\/github\.com\/[^\/]*\/[^\/]*\/(issues|pull)\/(\d*)\#issuecomment\-(\d*)/.exec(url);
    return {
        pageType,
        issueID: pageType === 'issues' ? id : undefined,
        prID: pageType === 'pull' ? id : undefined,
        commentID,
    };
}
