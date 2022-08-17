import React from 'react';
import ReactDOM from 'react-dom'
import DomRoot from "../components/DomRoot";

export function hookReactComponentToDom(element, containerId) {
    const container = document.createElement('div');
    container.id = containerId;
    ReactDOM.render(
        <DomRoot>
            {element}
        </DomRoot>
        , container);
    return container;
}
