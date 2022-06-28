import React, {Component} from 'react'
import {subscribeToIssue, getActiveIssueIDFromURL} from '../actions/issue';
import InjectedCardLayout from './InjectedCardLayout';

class SubscribeIssue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {},
        };
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
            <InjectedCardLayout>
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

export default SubscribeIssue;
