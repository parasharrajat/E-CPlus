import browser from 'webextension-polyfill';
import {NOTE_TYPE, sendDataToBG, STORAGE_KEYS} from './common';

export function getActiveIssueIDFromURL(url) {
    switch (true) {
        case /issues\/\d*\/?$/.text(url.pathname):
            return /issues\/(\d*)\/?$/.exec(window.location)[1];
        case /pull\/\d*\/?$/.test(url.pathname):
            return /pull\/\d*\/?$/.exec(window.location)[1];
        default: return null;
    }
}

export function subscribeToIssue(id, options) {
    return sendDataToBG({
        op: 'add',
        data: {
            id,
            subsciptions: Object.keys(options).filter((key) => !!options[key]),
        },
    }).then();
}

export function addProposalNote(commentID, issueID, link, note, userHandle, userAvatar) {
    return sendDataToBG({
        op: 'add',
        data: {
            noteType: NOTE_TYPE.PROPOSAL,
            id: `${STORAGE_KEYS.NOTE}${issueID}_${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`,
            link,
            note,
            issue: issueID,
            commentID,
            userHandle,
            userAvatar,
        },
    }).then();
}
export async function getProposalComments() {
    const response = await sendDataToBG({
        op: 'get',
        data: {
            id: `${STORAGE_KEYS.PROPOSAL_COMMENT}*`,
        },
    });
    console.debug(response.data);
    return response.data;
}

export function removeProposalNote(note) {
    browser.storage.local.remove(`${STORAGE_KEYS.NOTE}${note.issue}_${STORAGE_KEYS.PROPOSAL_COMMENT}${note.commentID}`);
}

export function markProposalReviewed(commentID) {
    return sendDataToBG({
        op: 'add',
        data: {
            id: `${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`,
            reviewed: true,
        },
    }).then();
}
