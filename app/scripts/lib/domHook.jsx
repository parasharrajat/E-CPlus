import React from 'react';
import ReactDOM from 'react-dom';
import DomRoot from '../components/DomRoot';

export default function domHook(element, containerId) {
    const container = document.createElement('div');
    container.id = containerId;
    ReactDOM.render(
        <DomRoot>
            {element}
        </DomRoot>,
        container,
    );
    return container;
}
