import React, {Component} from 'react'
import Button from './Button';
import Dropdown from './Dropdown';

class Actions extends Component {
    getAction(action) {
        switch (action.type) {
            case 'button':
                return <Button {...action.props} />;
            case 'tabs':
                return <Tabs {...action.props} />;
            case 'dropdown':
                return <Dropdown {...action.props} />;
        }
    }
    render() {
        return (
            <div className="flex-items-center flex-auto d-flex">
                {this.props.actions.map((action, index) => {
                    return (<div className='ml-2' key={'action' + index}>{this.getAction(action)}</div>);
                })}
            </div>);
    }
}

export default Actions;
