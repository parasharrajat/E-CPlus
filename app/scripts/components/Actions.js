import React, {Component} from 'react'
import {Button} from './Button';

class Actions extends Component {
    render() {
        return (
            <div className="table-list-header-toggle states flex-auto pl-0">
                {this.props.actions.map((action, index) => {
                    switch (t.type) {
                        case 'button':
                            return <Button key={'action' + index} {...action.props} />;
                        case 'tabs':
                            return <Tabs key={'action' + index} {...action.props} />;
                    }
                })}
            </div>);
    }
}

export default Actions;
