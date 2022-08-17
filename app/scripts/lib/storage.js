import browser from 'webextension-polyfill';

const storedKeys = {};
let resolveReadyPromoise = () => {};
let isSynced = false;
const isReadyPromise = new Promise((resolve) => {
    resolveReadyPromoise = resolve;
});

function updateStoredKeys() {
    browser.storage.local.get().then((keyValuePairs) => {
        Object.keys(keyValuePairs).forEach((key) => {
            storedKeys[key] = undefined;
        });
        isSynced = true;
        resolveReadyPromoise();
    });
}

function isReady() {
    if (isSynced) {
        return isReadyPromise;
    }
    updateStoredKeys();
    return isReadyPromise;
}

function addChangedkeysToStore(changes, area) {
    if (area !== 'local') {
        return;
    }
    Object.keys(changes).forEach((key) => {
        if (changes[key].newValue) {
            storedKeys[key] = undefined;
        } else {
            delete storedKeys[key];
        }
    });
}

function getStoredKeys() {
    return Object.keys(storedKeys);
}

browser.storage.onChanged.removeListener(addChangedkeysToStore);
browser.storage.onChanged.addListener(addChangedkeysToStore);

export default {isReady, getStoredKeys};
