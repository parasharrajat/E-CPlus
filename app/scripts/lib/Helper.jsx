import React from 'react';
import {CheckIcon, PencilIcon, XIcon} from '@primer/octicons-react';
import {
    Box, Button, Label, LabelGroup, StyledOcticon,
} from '@primer/react';
import browser from 'webextension-polyfill';
import domHook from './domHook';
import {NOTE_TYPE} from '../actions/common';
import proposalNoteModal from './proposalNoteModal';

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

function markPRChecklistStatus() {
    const PRbodyEls = document.querySelectorAll('.TimelineItem.js-command-palette-pull-body .edit-comment-hide .comment-body > * ');
    const [checkListheading] = Array.from(PRbodyEls).filter((el) => el.textContent.trim().toLowerCase() === 'contributor (pr author) checklist');

    if (!checkListheading) {
        return;
    }
    const sublist = checkListheading.nextElementSibling.closest('ul.contains-task-list');
    if (!sublist) {
        return;
    }
    const allCheckItems = sublist.querySelectorAll('input[type="checkbox"]');
    const hasAllCheckboxesMarkedOnPR = !Array.from(allCheckItems).some((el) => !el.checked);

    const UI = (
        <Box flexDirection="row">
            <LabelGroup>
                {
                    !hasAllCheckboxesMarkedOnPR && (
                        <Label sx={{
                            color: 'fg.onEmphasis', bg: 'danger.emphasis', p: 2,
                        }}
                        >
                            <StyledOcticon icon={XIcon} size={16} color="fg.onEmphasis" sx={{mr: 2}} />
                            Incomplete PR Checklist
                        </Label>
                    )
                }
                {
                    hasAllCheckboxesMarkedOnPR && (
                        <Label sx={{
                            color: 'fg.onEmphasis', bg: 'success.emphasis', p: 2,
                        }}
                        >
                            <StyledOcticon icon={CheckIcon} size={16} color="fg.onEmphasis" sx={{mr: 2}} />
                            PR Checklist Completed
                        </Label>
                    )
                }
            </LabelGroup>
        </Box>
    );

    const container = domHook(UI, 'expensiContributor-headerTitleRoot1');
    document.querySelector('#partial-discussion-header .gh-header-show').prepend(container);
    const stickycontainer2 = domHook(UI, 'expensiContributor-headerTitleRoot2');
    document.querySelector('#partial-discussion-header .gh-header-sticky > div>div>div').append(stickycontainer2);
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

function enableIssuePRNotes() {
    const addProposal = () => proposalNoteModal.show(window.location.origin + window.location.pathname, '', '', NOTE_TYPE.ISSUE);
    const UI = <Button sx={{ml: 2}} leadingIcon={PencilIcon} size="small" onClick={addProposal}>Note</Button>;
    const container = domHook(UI, 'expensiContributor-headerTitleRoot1');
    document.querySelector('#partial-discussion-header .gh-header-show .gh-header-actions').prepend(container);
    const stickycontainer2 = domHook(UI, 'expensiContributor-headerTitleRoot2');
    document.querySelector('#partial-discussion-header .gh-header-sticky > div>div').append(stickycontainer2);
    stickycontainer2.style.marginLeft = 'auto';
}

export default {
    getGhTitle,
    isCommentProposal,
    isAutoAssignmentComment,
    isProposalArrovedComment,
    isUserAssignedComment,
    markPRChecklistStatus,
    getAsset,
    isTurboEnabled,
    getPageType,
    syncUrlCache,
    enableIssuePRNotes,
};
