import browser from 'webextension-polyfill';
import {STORAGE_KEYS} from './common';
import cPlusView from './cPlusView';

function toggleCPlusView(on) {
    browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {...data[STORAGE_KEYS.SETTINGS], cPlusView: !!on},
        });

        if (on) {
            cPlusView.on();
        } else {
            cPlusView.off();
        }
    });
}

function addChecklist(checklist) {
    browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        const oldData = data[STORAGE_KEYS.SETTINGS];
        browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {
                ...oldData,
                checklists: [...(oldData.checklists || []), {...checklist, id: new Date().getTime()}],
            },
        });
    });
}

function updateChecklist(id, checklist) {
    browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        const oldData = data[STORAGE_KEYS.SETTINGS];
        const checklistIndex = oldData.checklists.findIndex((ck) => ck.id === id);
        oldData.checklists[checklistIndex] = {...checklist};
        browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {
                ...oldData,
                checklists: oldData.checklists,
            },
        });
    });
}

function removeChecklist(id) {
    browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        const oldData = data[STORAGE_KEYS.SETTINGS];
        browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {
                ...oldData,
                checklists: oldData.checklists.filter((ck) => ck.id !== id),
            },
        });
    });
}

function updateChecklistRules(rules) {
    browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        const oldData = data[STORAGE_KEYS.SETTINGS];
        browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {
                ...oldData,
                checklistRules: rules,
            },
        });
    });
}

export default {
    toggleCPlusView, addChecklist, updateChecklist, removeChecklist, updateChecklistRules,
};
