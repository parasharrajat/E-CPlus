import React, {Component} from "react";
import Button from "./Button";

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    render() {
        return (
            <details className="details-overlay details-reset position-relative d-inline-block">
                <summary ref={el => this.trigger = el} data-view-component="true" className="timeline-comment-action Link--secondary btn-link" aria-haspopup="menu" role="button">
                    {this.props.buttonTitle}
                </summary>
                <detail-menu class="dropdown-menu dropdown-menu-sw show-more-popover color-fg-default anim-scale-in" style={{'width':185}} role="menu">
                    {this.props.actions.map((action, index) => {
                        if(action.divider){
                            return (<div role="none" className="dropdown-divider" key={'d-action' + index}></div>);
                        }
                        return (<Button title={action.title} classes={['btn-link', 'dropdown-item']} key={'d-action' + index} onClick={(e) => {
                            action.onClick(e);
                            this.trigger.click();
                        }}/>);
                    })}
                </detail-menu>
            </details>
        );
    }
}
