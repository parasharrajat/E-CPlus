import React, {Component} from "react";
export default class Button extends Component {
    render() {
        const className = this.props.classes || [
            'btn',
            (this.props.sm || (!this.props.sm && !this.props.lg)) && 'btn-sm',
            this.props.lg && 'btn-lg',
            (this.props.primary || (!this.props.primary && !this.props.primary)) && 'btn-primary',
            this.props.secondary && 'btn-secondary',
        ];
        const Icon = this.props.icon;
        const iconSize = this.props.lg ? 32 : 16;
        return (
            <button className={className.join(' ')} onClick={this.props.onClick}>
                {Boolean(this.props.icon) &&
                    <>
                        <Icon size={iconSize} />
                        {' '}
                    </>}
                {this.props.title}
            </button>
        );
    }
}
