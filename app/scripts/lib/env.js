export function isDev() {
    return process.env.NODE_ENV === 'development';
}
window.EXPOSED = {};

/**
 * Expose a function on Dev build
 * @param {Function} func
 */
export function expose(func) {
    if (isDev()) {
        window.top.EXPOSED[func.name] = func;
    }
}
