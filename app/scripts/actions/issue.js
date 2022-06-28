import {sendDataToBG} from "./common";

export function getActiveIssueIDFromURL() {
    switch (true) {
        case /issues\/\d*\/?$/.text(url.pathname):
            return /issues\/(\d*)\/?$/.exec(window.location)[1];
        case /pull\/\d*\/?$/.test(url.pathname):
            return /pull\/\d*\/?$/.exec(window.location)[1]
    }
    return null;
}

export function subscribeToIssue(id, options) {
    return sendDataToBG({
        end: 'add',
        data: {
            id,
            subsciptions: Object.keys(options).filter(key => !!options[key])
        }
    }).then();
}
