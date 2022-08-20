import browser from 'webextension-polyfill';

const urlCache = {
    get: (key) => {
        const data = sessionStorage.getItem(`urlCache-${browser.runtime.id}`);
        if (!key) {
            return data ? JSON.parse(data) : {};
        }
        return data ? JSON.parse(data)[key] : null;
    },
    set: (key, value) => sessionStorage.setItem(`urlCache-${browser.runtime.id}`, JSON.stringify({
        ...urlCache.get(),
        [key]: value,
    })),
};

/**
 * @param {Object} message
 * @param {'push'|'pull'} message.op
 * @param {any} message.data
 */
function syncUrlCache({op, data}) {
    console.debug(op, data);
    if (op === 'push' && !data.urlCache) {
        return;
    }

    if (op === 'push') {
        Object.keys(data.urlCache).forEach((key) => {
            urlCache.set(key, data.urlCache[key]);
        });
    }
    if (op === 'pull') {
        browser.runtime.sendMessage({op: 'push', data: {urlCache: urlCache.get()}});
    }
}

async function getGhTitle(link) {
    const cacheData = urlCache.get(link);
    if (cacheData) {
        return cacheData;
    }
    const response = await fetch(link);
    if (!response.ok) {
        return '';
    }
    const body = await response.text();
    const parser = new DOMParser();
    const DOM = parser.parseFromString(body, 'text/html');
    const title = DOM.querySelector('head > title')?.innerHTML;
    urlCache.set(link, title);
    return title;
}

function isCommentProposal(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().split('\n')[0].match(/proposal/i);
    }
}

function isAutoAssignmentComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().toLowerCase().includes('triggered auto assignment');
    }
}

function isUserAssignedComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (contentNode) {
        return contentNode.textContent.trim().toLowerCase().includes('you have been assigned to this job');
    }
}

function isProposalArrovedComment(node) {
    const contentNode = node.querySelector('.edit-comment-hide');
    if (!contentNode) {
        return;
    }
    const hasEmojies = Array.from(contentNode.querySelectorAll('g-emoji')).reduce((final, emojiNode) => final + emojiNode.getAttribute('alias'), '') === 'ribboneyesribbon';
    return hasEmojies && contentNode.textContent.trim().toLowerCase().includes('c+ reviewed');
}
function getAsset(path) {
    return browser.runtime.getURL(path);
}

function isTurboEnabled() {
    return !!document.querySelector('meta[name="turbo-cache-control"], meta[name="turbo-visit-control"], meta[name="turbo-root"]');
}

function getPageType() {
    switch (true) {
        case /issues$/.test(window.location.pathname): return 'issues-list';
        case /pulls$/.test(window.location.pathname): return 'pr-list';
        case /issues\/\d*\/?$/.test(window.location.pathname): return 'issue';
        case /pull\/\d*\/?$/.test(window.location.pathname): return 'pr';
        default: return null;
    }
}

export default {
    getGhTitle,
    isCommentProposal,
    isAutoAssignmentComment,
    isProposalArrovedComment,
    isUserAssignedComment,
    getAsset,
    isTurboEnabled,
    getPageType,
    syncUrlCache,
};
