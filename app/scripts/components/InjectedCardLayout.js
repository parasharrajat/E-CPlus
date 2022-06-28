import React, {Component} from 'react'
import Tabs from './Tabs';

class InjectedCardLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: null
        };
    }
    render() {
        return (
            <div className="timeline-comment unminimized-comment comment js-task-list-container js-comment mt-3">
                <div className="timeline-comment-header clearfix d-block d-sm-flex">
                    <div className="timeline-comment-actions flex-shrink-0">
                        {this.props.tabs &&
                            <Tabs tabs={this.props.tabs} selected={this.state.selectedTab} onSelect={(tab) => this.setState({selectedTab: tab.id})} />
                        }
                    </div>
                    <h3 className="timeline-comment-header-text f5 text-normal">
                        {this.props.title || 'ExpensiContributor'}
                    </h3>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default InjectedCardLayout;
