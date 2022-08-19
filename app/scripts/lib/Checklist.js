
const getItemAtLevel = (node, l) => {
    if (l === 0) {
        return node;
    }
    const childen = node.children[node.children.length - 1];
    return getItemAtLevel(childen, l - 1);
};

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
    const lines = raw.trim().matchAll(/^(\s*)-\s*\[(.)](.*)/gm);
    const items = {children: []};
    let lastLineIndent = 0;
    let level = 0;

    Array.from(lines).forEach((line, index) => {
        const indent = line[1].length;
        const checked = !!line[2].trim();
        const content = line[3];
        if (index === 0) {
            items.children.push({
                content,
                indent,
                checked,
                children: [],
            });
            level = 0;
        } else if (indent > lastLineIndent) {
            getItemAtLevel(items, level + 1).children.push({
                content,
                indent,
                checked,
                children: [],
            });
            level += 1;
        } else if (indent === lastLineIndent) {
            getItemAtLevel(items, level).children.push({
                content,
                indent,
                checked,
                children: [],
            });
        } else {
            let item;

            // decrease the level until we find an item whose indent is less than or equal the indent
            do {
                level -= 1;
                item = getItemAtLevel(items, level);
            } while (item.indent >= indent);
            item.children.push({
                content,
                indent,
                checked,
                children: [],
            });
        }
        lastLineIndent = indent;
    });
    return items.children;
}

export default {
    parseChecklistMD,
    getItemAtLevel,
};
