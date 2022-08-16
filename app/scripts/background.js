import browser from 'webextension-polyfill';

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

function clientRequestHandler(request, sender, sendResponse) {
    console.debug('Message from the content script:', request);
    switch (request.end) {
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
}

setup();
