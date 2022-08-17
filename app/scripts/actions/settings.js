import Browser from 'webextension-polyfill';
import {STORAGE_KEYS} from './common';

function toggleCPlusView(on) {
    Browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((settings) => {
        Browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {...settings, cPlusView: !!on},
        });
    });
}

export default {toggleCPlusView};
