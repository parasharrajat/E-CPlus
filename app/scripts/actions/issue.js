import {sendDataToBG, STORAGE_KEYS} from './common';

export function getActiveIssueIDFromURL() {
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
        end: 'add',
        data: {
            id,
            subsciptions: Object.keys(options).filter((key) => !!options[key]),
        },
    }).then();
}

export function addProposalNote(commentID, issueID, link, note) {
    return sendDataToBG({
        end: 'add',
        data: {
            id: `${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`,
            link,
            note,
            issue: issueID,
            commentID,
        },
    }).then();
}
export async function getProposalComments() {
    const response = await sendDataToBG({
        end: 'get',
        data: {
            id: `${STORAGE_KEYS.PROPOSAL_COMMENT}*`,
        },
    });
    console.debug(response.data);
    return response.data;
}

export function markProposalReviewed(commentID) {
    return sendDataToBG({
        end: 'add',
        data: {
            id: `${STORAGE_KEYS.PROPOSAL_COMMENT}${commentID}`,
            reviewed: true,
        },
    }).then();
}
