import React from 'react';
import ReviewerRoot from './contentScript/ReviewerRoot';
import SidebarRoot from './contentScript/SidebarRoot';
import domHook from './lib/domHook';
import Helper from './lib/Helper';
import Navigation from './lib/Navigation';
import Session from './lib/Session';

function init() {
    const pageType = Helper.getPageType();

    if (pageType === 'issue' || pageType === 'pr') {
        const reviewerRootContainer = domHook(<ReviewerRoot />, 'expensiContributor-reviewerRoot');
        document.querySelector('#partial-discussion-sidebar').prepend(reviewerRootContainer);
    }

    const sidebarRootContainer = domHook(<SidebarRoot />, 'expensiContributor-sidebarRoot');
    document.querySelector('body').prepend(sidebarRootContainer);
}

init();
Navigation.onPageNavigationListener(init);
Session.registerSyncHandler(Helper.syncUrlCache);
Session.syncInit();
Session.syncTab();
