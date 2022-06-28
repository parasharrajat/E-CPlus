import {XIcon} from '@primer/octicons-react';
import React, {Component} from 'react'

class Modal extends Component {
    render() {
        return (
            <>
            {this.props.isVisible && <div className='bg-overlay'></div>}
            <details-dialog class={`Box Box--overlay d-flex flex-column anim-fade-in fast Box-overlay--wide overflow-visible ${this.props.isVisible ? 'd-flex': 'd-none'}`} role="dialog" aria-modal="true">
                <div className="Box-header">
                    <button className="Box-btn-octicon btn-octicon float-right" type="button" aria-label="Close dialog" data-close-dialog="" onClick={this.props.onClose}>
                        <XIcon />
                    </button>
                    <h3 className="Box-title">{this.props.title}</h3>
                </div>
                <div className="Box-body overflow-auto">
                    {this.props.children}
                </div>
            </details-dialog>
            </>
        );
    }
}

export default Modal;
