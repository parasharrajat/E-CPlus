import browser from 'webextension-polyfill';
import {STORAGE_KEYS} from './common';

function savePageChecklist(url, checklistData) {
    const {origin, pathname} = new URL(url);
    const key = `${STORAGE_KEYS.PAGE_CHECKLIST}${origin}${pathname}_${checklistData.id}`;
    browser.storage.local.get(key).then((data) => {
        const oldData = data[key];
        browser.storage.local.set({
            [key]: {
                ...(oldData || {}),
                ...checklistData,
            },
        });
    });
}

function removePageChecklist(url, checklistID) {
    const {origin, pathname} = new URL(url);
    const key = `${STORAGE_KEYS.PAGE_CHECKLIST}${origin}${pathname}_${checklistID}`;
    browser.storage.local.remove(key);
}

export default {
    savePageChecklist, removePageChecklist,
};
