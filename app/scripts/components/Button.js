import {Component} from "react";

export class Button extends Component {
    render() {
        const className = [
            'btn',
            this.props.sm && 'btn-sm',
            this.props.lg && 'btn-lg',
            this.props.primary && 'btn-primary',
            this.props.secondary && 'btn-secondary',
        ];
        const Icon = this.props.icon;
         const iconSize = this.props.lg ? 32 : 16;
        return (
            <button className={className} onClick={this.props.action}>
                {this.props.icon && <Icon size={iconSize} />}
                {this.props.title}
            </button>
        );
    }
}
