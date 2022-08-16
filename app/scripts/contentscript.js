import React from 'react'
import ReactDOM from 'react-dom'
import ReviewerRoot from './contentScript/ReviewerRoot';
import SubscribeRoot from './contentScript/SubscribeRoot';
import {hookReactComponentToDom} from './lib/domHook';

const subscribeRootContainer = hookReactComponentToDom(<SubscribeRoot />, 'expensiContributor-subscribeRoot');
// subscribeRootContainer.id = 'expensiContributor-subscribeRoot';

const reviewerRootContainer = hookReactComponentToDom(<ReviewerRoot />, 'expensiContributor-reviewerRoot');
// reviewerRootContainer.id = 'expensiContributor-reviewerRoot';


document.querySelector('#partial-discussion-sidebar').appendChild(subscribeRootContainer);
document.querySelector('#partial-discussion-sidebar').prepend(reviewerRootContainer);
