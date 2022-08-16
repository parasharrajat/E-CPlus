import React from 'react';
import SubscribeIssue from '../components/SubscribeIssue';

function SubscribeRoot() {
    const url = new URL(window.location);
    switch (true) {
    case /issues\/\d*\/?$/.test(url.pathname):
        return (
            <SubscribeIssue />
        );
    case /pull\/\d*\/?$/.test(url.pathname):
        return (
            <SubscribeIssue />
        );

    default: break;
    }

    return null;
}

export default SubscribeRoot;
