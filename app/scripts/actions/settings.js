import Browser from 'webextension-polyfill';
import {expose} from '../lib/env';
import {STORAGE_KEYS} from './common';

function toggleCPlusView(on) {
    Browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((data) => {
        Browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {...data[STORAGE_KEYS.SETTINGS], cPlusView: !!on},
        });
    });
}

function clear() {
    Browser.storage.local.clear();
}

expose(clear);

export default {toggleCPlusView};
