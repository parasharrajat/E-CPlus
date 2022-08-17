function onPageNavigationListener(navigationHandler) {
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

    return () => observer.disconnect();
}

function triggerPaginate(paginateContainer) {
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

export default {
    onPageNavigationListener,
    triggerPaginate,
};
