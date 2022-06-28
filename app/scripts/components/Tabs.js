import React, {Component} from 'react'

class Tabs extends Component {
    render() {
        return (
            <div className="table-list-header-toggle states flex-auto pl-0">
                {this.props.tabs.map((t, index) => {
                    const className = `btn-link ${this.props.selected === t.id ? 'selected' : ''}`;
                    return (<button key={'tabs' + index} className={className} onClick={() => this.props.onSelect(t)}>
                        {t.title}
                    </button>);
                })}
            </div>);
    }
}

export default Tabs;
