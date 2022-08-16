import {BookIcon, ChecklistIcon} from '@primer/octicons-react';
import React, {Component} from 'react';
import {
    Box, UnderlineNav, Heading, Text,
} from '@primer/react';
import AddProposalNoteModal from '../components/AddProposalNoteModal';
import '../../styles/contentscript.css';
import {hookReactComponentToDom} from '../lib/domHook';
import ProposalActions from '../components/ProposalActions';
import {proposalModalRef} from '../lib/proposalNoteModal';

import {getActiveIssueIDFromURL, subscribeToIssue} from '../actions/issue';

class ReviewerRoot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            selectedTab: 'main',
        };
        this.tabs = [
            {
                title: 'Main',
                key: 'main',
            },
            {
                title: 'Notes',
                key: 'notes',
                icon: BookIcon,
            },
            {
                title: 'CheckList',
                key: 'checklist',
                icon: ChecklistIcon,

            },
        ];
        this.proposalCommentsTagged = [];
        this.findProposalCommentsAndFeatures = this.findProposalCommentsAndFeatures.bind(this);
    }

    componentDidMount() {
        try {
            this.findProposalCommentsAndFeatures(
                document.querySelectorAll('.js-discussion [id^=issuecomment-]'),
            );
            this.observeProposalComments();

            // Set the correct ref to modal
            proposalModalRef.current = {
                show: (commentLink) => {
                    this.setState({
                        addProposalNote: {
                            isVisible: true,
                            link: commentLink,
                        },
                    });
                },
                hide: () => {
                    this.setState({addProposalNote: {isVisible: false, link: ''}});
                },
            };
        } catch (e) {
            console.error(e);
        }
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    saveOptions = (id, value) => {
        this.setState({error: ''});
        this.setState((prevState) => ({
            options: {...prevState.options, [id]: value},
        }));
    };

    submitForm = (e) => {
        e.preventDefault();
        if (!Object.values(this.state.options).includes(true)) {
            this.setState({error: 'You need to select one of the options.'});
            return;
        }
        this.setState({error: ''});
        subscribeToIssue(getActiveIssueIDFromURL(), this.state.options);
    };

    selectTab = (e, tab) => {
        e.preventDefault();
        this.setState({selectedTab: tab.key});
    };

    findProposalCommentsAndFeatures(nodes) {
        Array.from(nodes)
            .filter(
                (node) => node.id?.includes('issuecomment-')
                    && !this.proposalCommentsTagged.includes(node.id),
            )
            .filter((node) => {
                const contentNode = node.querySelector('.edit-comment-hide');
                if (contentNode) {
                    return contentNode.textContent.trim().match(/^proposal/gi);
                }
                return false;
            })
            .forEach((node) => {
                const actions = node.querySelector(
                    '.timeline-comment-header .timeline-comment-actions',
                );
                if (actions) {
                    const container = hookReactComponentToDom(
                        <ProposalActions />,
                        'expensiContributor-proposalActions',
                    );
                    container.setAttribute('class', 'mr-2');
                    actions.prepend(container);
                    this.proposalCommentsTagged.push(node.id);
                }
            });
    }

    observeProposalComments() {
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('.js-discussion');
        const config = {attributes: false, childList: true, subtree: true};
        const callback = (mutationList, observer) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length) {
                        this.findProposalCommentsAndFeatures(mutation.addedNodes);
                    }
                    if (mutation.removedNodes.length) {
                        mutation.removedNodes.forEach((node) => {
                            const index = this.proposalCommentsTagged.indexOf(node.id);
                            if (index !== -1) {
                                this.proposalCommentsTagged.splice(index, 1);
                            }
                        });
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        this.observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        this.observer.observe(targetNode, config);
    }

    renderTabContent = (tab) => {
        switch (tab) {
        case 'main': return (
            <>
                {this.state.error && (
                    <p className="flash p-2">{this.state.error}</p>
                )}
                <form onSubmit={this.submitForm}>
                    <p className="card-text">Subscribe the issue to track payment</p>
                    <div className="form-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => this.saveOptions(1, e.target.checked)}
                            />
                            Issue Payment
                        </label>
                        <p className="note">
                            This will let you mark different payment statuses.
                        </p>
                    </div>
                    <div className="form-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => this.saveOptions(2, e.target.checked)}
                            />
                            Issue Timeline
                        </label>
                        <p className="note">
                            This will track issue timeline specific to ExpensiContributor.
                        </p>
                    </div>
                    <div className="form-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => this.saveOptions(3, e.target.checked)}
                            />
                            PR status
                        </label>
                        <p className="note">
                            This track the PR related acitivity of the issue.
                        </p>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                        Subscribe
                    </button>
                </form>
            </>
        );
        default: return null;
        }
    };


    render() {
        return (
            <>
                <AddProposalNoteModal
                    proposalLink={this.state.addProposalNote?.link}
                    isVisible={this.state.addProposalNote?.isVisible}
                    onCancel={() => this.setState({addProposalNote: {isVisible: false, link: ''}})}
                />

                <Box
                    borderColor="border.default"
                    borderWidth={1}
                    borderStyle="solid"
                    borderRadius={2}
                >
                    <Heading sx={{fontSize: 3, p: 2}}>ExpensiContributor</Heading>
                    <UnderlineNav full>
                        {this.tabs.map((tab) => (
                            <UnderlineNav.Link sx={{p: 2}} href="#" selected={this.state.selectedTab === tab.key} onClick={(e) => this.selectTab(e, tab)}>
                                {tab.icon && <tab.icon />}
                                <Text sx={{ml: tab.icon ? 1 : null}}>{tab.title}</Text>
                            </UnderlineNav.Link>
                        ))}
                    </UnderlineNav>
                    <Box p={3}>
                        {this.renderTabContent(this.state.selectedTab)}
                    </Box>
                </Box>
            </>
        );
    }
}

export default ReviewerRoot;