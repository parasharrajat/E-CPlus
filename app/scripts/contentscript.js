import React from 'react'
import ReactDOM from 'react-dom'
import ReviewerRoot from './contentScript/ReviewerRoot';
import SubscribeRoot from './contentScript/SubscribeRoot';

const subscribeRootContainer = document.createElement('div');
subscribeRootContainer.id = 'expensiContributor-subscribeRoot';

const reviewerRootContainer = document.createElement('div');
reviewerRootContainer.id = 'expensiContributor-reviewerRoot';


document.querySelector('#partial-discussion-sidebar').appendChild(subscribeRootContainer);
document.querySelector('#partial-discussion-sidebar').prepend(reviewerRootContainer);
ReactDOM.render(<SubscribeRoot />, subscribeRootContainer);
ReactDOM.render(<ReviewerRoot />, reviewerRootContainer);
