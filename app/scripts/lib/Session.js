import Browser from 'webextension-polyfill';
import {BROWSER_EXTENSION_ID} from '../actions/common';

function getActionUsername() {
    return document.querySelector('user-login');
}

function isUserSessionActive() {
    return !!getActionUsername();
}

const syncHandlers = [];
function registerSyncHandler(callback) {
    syncHandlers.push(callback);
}

function syncInit() {
    syncInit.handler = (data, sender) => {
        if (sender.id !== BROWSER_EXTENSION_ID) {
            return new Error('Very Bad!');
        }
        console.debug('handler', syncInit.handler);
        syncHandlers.forEach((callback) => callback(data, sender));
    };
    console.debug('handler', syncInit.handler);

    Browser.runtime.onMessage.removeListener(syncInit.handler);
    Browser.runtime.onMessage.addListener(syncInit.handler);
}

function syncTab() {
    Browser.runtime.sendMessage({op: 'pull'});
}

export default {
    getActionUsername,
    isUserSessionActive,
    registerSyncHandler,
    syncInit,
    syncTab,
};
