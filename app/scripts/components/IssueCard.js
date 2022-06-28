import React, {Component} from 'react'

class IssueCard extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        {this.props.id}
                        <small className="text-muted">{this.props.created}</small>
                    </h5>
                    <p className="card-text">{this.props.title}</p>
                    {this.props.isMerged &&
                        <div className="d-flex">
                            <span className="badge badge-info">merged</span>
                            <span className="date">merged</span>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default IssueCard;
