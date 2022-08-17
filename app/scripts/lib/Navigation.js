function onPageNavigationListener(navigationHandler) {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('head title');
    const config = {characterData: true};
    const callback = (mutationList, observer) => {
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

export default {
    onPageNavigationListener,
};
