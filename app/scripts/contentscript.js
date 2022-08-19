import React from 'react';
import ReviewerRoot from './contentScript/ReviewerRoot';
import SidebarRoot from './contentScript/SidebarRoot';
import SubscribeRoot from './contentScript/SubscribeRoot';
import domHook from './lib/domHook';
import {isDev} from './lib/env';
import Navigation from './lib/Navigation';

function init() {
    if (isDev()) {
        const subscribeRootContainer = domHook(<SubscribeRoot />, 'expensiContributor-subscribeRoot');
        document.querySelector('#partial-discussion-sidebar').appendChild(subscribeRootContainer);
    }
    const reviewerRootContainer = domHook(<ReviewerRoot />, 'expensiContributor-reviewerRoot');
    const sidebarRootContainer = domHook(<SidebarRoot />, 'expensiContributor-sidebarRoot');
    document.querySelector('#partial-discussion-sidebar').prepend(reviewerRootContainer);
    document.querySelector('body').prepend(sidebarRootContainer);
}

init();
Navigation.onPageNavigationListener(init);
