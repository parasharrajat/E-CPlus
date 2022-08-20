import browser from 'webextension-polyfill';
import {BROWSER_EXTENSION_ID} from './actions/common';

function saveLocalData(key, newData) {
    return browser.storage.local.set({[key]: newData});
}
function readLocalData() {
    return JSON.parse(localStorage.getItem('mainFile'));
}

function get(id) {
    if (!id) {
        throw new Error('NO ID found');
    }
    const dataKeys = readLocalData();
    const data = {};
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in dataKeys) {
        const idReg = new RegExp(id.replace('*', '.*?'), 'gi');
        if (idReg.test(key)) {
            data[key] = dataKeys[key];
        }
    }
    return data;
}
function addRow(id, data) {
    if (!id) {
        throw new Error('NO ID found');
    }
    return saveLocalData(id, data);
}

function responseHandler(actionCallback, sendResponse) {
    try {
        const response = actionCallback();
        if (response instanceof Promise) {
            return response.then((data) => ({
                error: false,
                data,
            })).catch((e) => ({
                error: true,
                message: e.message,
            }));
        }
        sendResponse({
            error: false,
            data: response,
        });
    } catch (e) {
        sendResponse({
            error: true,
            message: e.message,
        });
    }
}

/**
 *  As Contentscripts can not talk to each other, we forward the sync request to Other targeted tabs on the app.
 * @param {any} message
 * @param {any} currentTab
 */
function forwardSyncCall(message, currentTab) {
    const handler = async (request, sender) => {
        if (sender.id !== BROWSER_EXTENSION_ID) {
            return Promise.resolve(new Error('Very Bad!'));
        }
        if (request.op !== 'pull' || request.op !== 'push') {
            return;
        }
        const tabs = await browser.tabs.query({url: `${new URL(currentTab.url).origin}/*`});
        console.debug(currentTab, tabs);
        tabs
            .filter((tb) => tb.id !== currentTab.id)
            .forEach((tab) => {
                browser.tabs.sendMessage(tab.id, message);
            });
    };
    browser.runtime.onMessage.addListener(handler);
}

function clientRequestHandler(request, sender, sendResponse) {
    console.debug('Message from the content script:', request);
    if (sender.id !== BROWSER_EXTENSION_ID) {
        return Promise.resolve(new Error('Very Bad!'));
    }
    switch (request.op) {
        case 'add': {
            const {id} = request.data;
            delete request.data.id;
            return responseHandler(() => addRow(id, request.data), sendResponse);
        }
        case 'get': {
            const {id} = request.data;
            delete request.data.id;
            return responseHandler(() => get(id), sendResponse);
        }
        default: return false;
    }
}

function setup() {
    localStorage.setItem('mainFile', JSON.stringify({}));
    browser.runtime.onMessage.addListener(clientRequestHandler);
    forwardSyncCall();
}

setup();
