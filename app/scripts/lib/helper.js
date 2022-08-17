const urlCache = {};

async function getGhTitle(link) {
    if (urlCache[link]) {
        return urlCache[link];
    }
    const response = await fetch(link);
    if (!response.ok) {
        return '';
    }
    const body = await response.text();
    const parser = new DOMParser();
    const DOM = parser.parseFromString(body, 'text/html');
    const title = DOM.querySelector('head > title')?.innerHTML;
    urlCache[link] = title;
    return title;
}

export default {getGhTitle};
