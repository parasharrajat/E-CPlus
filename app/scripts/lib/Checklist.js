
/**
 * parse CheckList MD
 *
 * @param {string} raw
 * @returns {Array<*>}
 */
function parseChecklistMD(raw) {
    if (!raw) {
        return;
    }
    const lines = raw.trim().matchAll(/^(\s*)-\s*\[\s\](.*)/gm);
    const items = [];
    let lastLineIndent = 0;
    Array.from(lines).forEach((line, index) => {
        const indent = line[1].length;
        const content = line[2];
        if (index === 0) {
            items.push({
                content,
                children: [],
            });
        } else if (indent >= lastLineIndent) {
            items[items.length - 1].children.push({
                content,
                children: [],
            });
        } else {
            items.push({
                content,
                children: [],
            });
        }
        lastLineIndent = indent;
    });
    console.debug(items);
    return items;
}

export default {
    parseChecklistMD,
};
