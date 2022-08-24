import {Box} from '@primer/react';
import React from 'react';
import domHook from '../lib/domHook';
import Helper from '../lib/Helper';
import Navigation from '../lib/Navigation';

function hideComment(element) {
    // eslint-disable-next-line no-param-reassign
    element.hidden = true;
    element.classList.add('ecp-hide-comment');
}
function showComment(element) {
    // eslint-disable-next-line no-param-reassign
    element.hidden = false;
    element.classList.remove('ecp-hide-comment');
}

function hideExtraComments() {
    // ORDER IS VERY IMPORANT FOR NODE FILTERING
    // BE CAREFUL WHILE MAKING CHNAGES TO THE FOLLOWING RULES
    let hasPRmergedEventReached = false;

    document.querySelectorAll('.js-discussion .TimelineItem').forEach((node) => {
        // IF pr is merged then show everything afterwards the merge timeline event
        if (hasPRmergedEventReached) {
            return;
        }

        // If Comment is the issue or PR body skip
        if (node.closest('.js-command-palette-issue-body,.js-command-palette-pull-body')) {
            return;
        }

        // If this is a part of Requested Changes
        if (node.closest('[id^="pullrequestreview-"')) {
            return;
        }

        // If Node is a commit timeline event
        if (node.closest('[data-test-selector="pr-timeline-commits-list"]')) {
            return;
        }

        const contentNode = node.querySelector('.TimelineItem-body');
        const isCommentNode = contentNode.closest('.js-comment-container');

        if (isCommentNode && Helper.isCommentProposal(contentNode)) {
            return;
        }

        if (isCommentNode && Helper.isAutoAssignmentComment(contentNode)) {
            return;
        }

        if (isCommentNode && Helper.isProposalArrovedComment(contentNode)) {
            return;
        }

        if (isCommentNode && Helper.isUserAssignedComment(contentNode)) {
            return;
        }

        // If node is title change timeline event
        if (contentNode.textContent.includes('changed the title')) {
            return;
        }

        // If node is merged commit timeline event
        if (contentNode.textContent.match(/merged commit[\d\w\s]*into/)) {
            hasPRmergedEventReached = true;
            return;
        }

        hideComment(node);
    });
}

function loadAllComments(parent) {
    const paginationContainer = parent.querySelector('#js-progressive-timeline-item-container');
    if (!paginationContainer) {
        return Promise.resolve();
    }
    return Navigation.triggerCommentsPagination(paginationContainer).then(() => {
        hideExtraComments();
        return loadAllComments(paginationContainer);
    });
}

let GalleryHiddenItems = [];

function organizeGallery(columnCount = 2, horizontal = false) {
    const PRbodyEls = document.querySelectorAll('.TimelineItem.js-command-palette-pull-body .edit-comment-hide .comment-body > * ');
    const screenshotHeadingIndex = Array.from(PRbodyEls).findIndex((el) => el.textContent.trim().toLowerCase().startsWith('screenshots')
    || el.textContent.trim().toLowerCase().endsWith('screenshots')
    || el.textContent.trim().toLowerCase().startsWith('video'));

    if (screenshotHeadingIndex === -1) {
        return;
    }
    const screenshotSublist = Array.from(PRbodyEls).slice(screenshotHeadingIndex + 1);
    if (!screenshotSublist.length) {
        return;
    }
    const galleryItems = [];
    screenshotSublist.forEach((el) => {
        if (el.childElementCount === 0 && el.textContent) {
            galleryItems.push({
                title: el.textContent,
                assets: [],
            });
        } else {
            const lastItem = galleryItems[galleryItems.length - 1];
            if (lastItem) {
                lastItem.assets.push(...Array.from(el.querySelectorAll('img,video, audio')));
            }
        }
    });
    if (!galleryItems.length) {
        return;
    }
    let gridTemplateColumns = '';
    // eslint-disable-next-line no-param-reassign
    while (columnCount--) {
        gridTemplateColumns += '1fr ';
    }
    const UI = (
        <Box
            sx={horizontal ? {
                position: 'relative',
                padding: '200px',
                overflowX: 'auto',
                width: '85vw',
                bg: 'canvas.default',
                border: '1px solid rgba(0,0,0,0.18)',
                borderRadius: 2,
                boxShadow: '0 0 19px 14px rgb(0 0 0 / 4%)',
                left: '-10vw',
                alignItems: 'center',
                display: 'flex',
            } : undefined}
        >

            <Box
                display="grid"
                gridTemplateColumns={gridTemplateColumns}
                gridGap="1px"
                sx={horizontal ? {
                    width: '100%',
                    display: 'flex',
                    position: 'absolute',
                    margin: '-200px',
                    bg: 'canvas.default',
                    zIndex: '222',
                } : undefined}
            >
                {galleryItems.map((item) => item.assets.map((asset) => (
                    <Box borderWidth={0} boxShadow="0 0 0 1px #d0d7de">
                        <Box bg="canvas.subtle" borderColor="border.default" borderWidth={0} borderBottomWidth={1} borderStyle="solid" textAlign="center">{item.title}</Box>
                        <Box
                            p={3}
                            sx={{
                                '>*': {
                                    objectFit: 'contain',
                                },
                            }}
                            dangerouslySetInnerHTML={{__html: asset.outerHTML}}
                            maxHeight={400}
                            display="flex"
                            alignContent="stretch"
                            justifyContent="center"
                        />
                    </Box>
                )))}
            </Box>
        </Box>
    );

    const container = domHook(UI, 'expensiContributor-gallery');
    Array.from(PRbodyEls)[screenshotHeadingIndex].after(container);
    // eslint-disable-next-line no-param-reassign
    Array.from(PRbodyEls).slice(screenshotHeadingIndex + 1).forEach((el) => el.hidden = true);
    return Array.from(PRbodyEls).slice(screenshotHeadingIndex + 1);
}

function resetGallery() {
    // eslint-disable-next-line no-param-reassign
    GalleryHiddenItems.forEach((el) => el.hidden = false);
    if (GalleryHiddenItems && GalleryHiddenItems.length) {
        document.querySelector('#expensiContributor-gallery').remove();
    }
    GalleryHiddenItems = [];
}

function on() {
    const hiddenItems = organizeGallery();
    if (hiddenItems && hiddenItems.length) {
        GalleryHiddenItems = hiddenItems;
    }
    loadAllComments(document);
    hideExtraComments();
}
function off() {
    document.querySelectorAll('.js-discussion .ecp-hide-comment').forEach((node) => showComment(node));
    resetGallery();
}
export default {on, off};
