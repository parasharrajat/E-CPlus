import React from 'react';
import ReviewerRoot from './contentScript/ReviewerRoot';
import SidebarRoot from './contentScript/SidebarRoot';
import SubscribeRoot from './contentScript/SubscribeRoot';
import {hookReactComponentToDom} from './lib/domHook';
import {isDev} from './lib/env';
import Navigation from './lib/Navigation';

function init() {
    if (isDev()) {
        const subscribeRootContainer = hookReactComponentToDom(<SubscribeRoot />, 'expensiContributor-subscribeRoot');
        document.querySelector('#partial-discussion-sidebar').appendChild(subscribeRootContainer);
    }
    const reviewerRootContainer = hookReactComponentToDom(<ReviewerRoot />, 'expensiContributor-reviewerRoot');
    const sidebarRootContainer = hookReactComponentToDom(<SidebarRoot />, 'expensiContributor-sidebarRoot');
    document.querySelector('#partial-discussion-sidebar').prepend(reviewerRootContainer);
    document.querySelector('body').prepend(sidebarRootContainer);
}

init();
Navigation.onPageNavigationListener(init);
