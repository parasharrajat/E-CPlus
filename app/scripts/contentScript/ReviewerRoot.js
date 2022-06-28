import {BookIcon, ChecklistIcon, EyeIcon, FileAddedIcon} from '@primer/octicons-react';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import InjectedCardLayout from '../components/InjectedCardLayout';
import Tabs from '../components/Tabs';

class ReviewerRoot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {},
        };
        this.proposalCommentsTagged = [];
        this.tabs = [
            {
                id: 1,
                title: 'Notes',
                icon: BookIcon
            },
            {
                id: 2,
                title: 'Checklist',
                icon: ChecklistIcon,
            },
        ];
        this.proposalTabs = [
            {
                id: 1,
                title: 'Add Note',
                icon: FileAddedIcon
            },
            {
                id: 2,
                title: 'Reviewed',
                icon: EyeIcon,
                isButton: true
            }
        ]
    }

    componentDidMount() {
        try{

            this.findProposalCommentsAndFeatures(document.querySelectorAll('.js-discussion [id^=issuecomment-]'));
            this.observeProposalComments();
        } catch(e){
            console.error(e);
        }
    }

    observeProposalComments() {
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('.js-discussion');
        const config = {attributes: false, childList: true, subtree: true};
        const callback = function (mutationList, observer) {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    if(mutation.addedNodes.length){
                        this.findProposalCommentsAndFeatures(mutation.addedNodes);
                    }
                    if(mutation.removedNodes.length){
                        mutation.removedNodes.forEach(node => {
                            const index = this.proposalCommentsTagged.indexOf(node.id);
                            if(index !== -1){
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
        this.observer.observe(targetNode, config)
    }

    componentWillUnmount(){
        this.observer.disconnect();
    }

    findProposalCommentsAndFeatures(nodes){
        Array.from(nodes)
        .filter(node => node.id?.includes('issuecomment-') && !this.proposalCommentsTagged.includes(node.id))
        .filter(node => {
            const contentNode = node.querySelector('.edit-comment-hide');
            if(contentNode){
               return contentNode.textContent.trim().match(/^proposal/ig);
            }
        })
        .forEach((node) => {
            const actions = node.querySelector('.timeline-comment-header .timeline-comment-actions');
            if(actions){
                const container = document.createElement('div');
                container.id= "expensiContributor-proposalActions";
                container.setAttribute('class', "mr-2");
                actions.prepend(container);
                ReactDOM.render(<Tabs tabs={this.tabs} onSelect={() => {}}/>, container);
                this.proposalCommentsTagged.push(node.id);
            }
        });
    }

    saveOptions = (id, value) => {
        this.setState({error: ''});
        this.setState(prevState => ({options: {...prevState.options, [id]: value}}))
    }

    submitForm = (e) => {
        e.preventDefault();
        if (!Object.values(this.state.options).includes(true)) {
            this.setState({error: 'You need to select one of the options.'});
            return;
        }
        this.setState({error: ''});
        subscribeToIssue(getActiveIssueIDFromURL(), this.state.options);
    }

    render() {
        return (
            <InjectedCardLayout tabs={this.tabs}>
                <div className="p-2">
                    {this.state.error &&
                        <p className="flash p-2">
                            {this.state.error}
                        </p>
                    }
                    <form onSubmit={this.submitForm}>
                        <p className="card-text">Subscribe the issue to track payment</p>
                        <div className="form-checkbox">
                            <label>
                                <input type="checkbox" onChange={(e) => this.saveOptions(1, e.target.checked)} />
                                Issue Payment
                            </label>
                            <p className="note">
                                This will let you mark different payment statuses.
                            </p>
                        </div>
                        <div className="form-checkbox">
                            <label>
                                <input type="checkbox" onChange={(e) => this.saveOptions(2, e.target.checked)} />
                                Issue Timeline
                            </label>
                            <p className="note">
                                This will track issue timeline specific to ExpensiContributor.
                            </p>
                        </div>
                        <div className="form-checkbox">
                            <label>
                                <input type="checkbox" onChange={(e) => this.saveOptions(3, e.target.checked)} />
                                PR status
                            </label>
                            <p className="note">
                                This track the PR related acitivity of the issue.
                            </p>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
                    </form>
                </div>
            </InjectedCardLayout>
        );
    }
}

export default ReviewerRoot;
