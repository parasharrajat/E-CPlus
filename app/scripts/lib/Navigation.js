import _ from 'underscore';
import Helper from './Helper';

const navigationListenerAbort = new AbortController();

function legacyNavigationListener(navigationHandler) {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('head title');
    const config = {characterData: true};
    const callback = (mutationList) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const mutation of mutationList) {
            if (mutation.type === 'characterData') {
                navigationHandler();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    navigationListenerAbort.signal.addEventListener('abort', () => observer.disconnect());
}

/**
 * @param {Function} callback
 */
function listenForTurboNavigation(callback) {
    window.addEventListener('turbo:render', _.debounce(callback, 300), {signal: navigationListenerAbort.signal});
}

function triggerCommentsPagination(paginateContainer) {
    console.debug('Pagination starts for', paginateContainer);
    return new Promise((resolve) => {
        const config = {childList: true};
        const callback = (mutationList, observer) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const mutation of mutationList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    observer.disconnect();
                    console.debug('Pagination complete for', paginateContainer);
                    resolve();
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(paginateContainer, config);

        const triggerButton = paginateContainer.querySelector('button.ajax-pagination-btn');
        if (triggerButton) {
            triggerButton.click();
        }
    });
}
function onPageNavigationListener(navigationHandler) {
    if (Helper.isTurboEnabled()) {
        listenForTurboNavigation(navigationHandler);
    } else {
        legacyNavigationListener(navigationHandler);
    }
}

function stopPageNavigationListener() {
    navigationListenerAbort.abort();
}

export default {
    triggerCommentsPagination,
    onPageNavigationListener,
    stopPageNavigationListener,
};
