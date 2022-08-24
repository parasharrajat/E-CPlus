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
    ISSUE: 'issue',
};

export const STORAGE_KEYS = {
    NOTE: 'note_',
    PROPOSAL_COMMENT: 'proposal_comment_',
    SETTINGS: 'settings_',
    PAGE_CHECKLIST: 'page_checklist',
};

export function parseCommentURL(url) {
    if (!url) {
        return {};
    }
    // eslint-disable-next-line no-useless-escape
    const [, pageType, id, commentID] = /https\:\/\/github\.com\/[^\/]*\/[^\/]*\/(issues|pull)\/(\d*)(?:\#issuecomment\-(\d*))?/.exec(url);
    return {
        pageType: pageType.toLowerCase() === 'issues' ? 'issue' : 'pr',

        // Both PR and issue can referred as issueID,
        issueID: id,
        commentID,
    };
}
