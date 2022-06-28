export function sendDataToBG(data){
    return browser.runtime.sendMessage(data);
}

export const ISSUE_SUBSCRIPTION = {
    PAYMENT: 1,
    TIMELINE: 2,
    PR: 3,
};
