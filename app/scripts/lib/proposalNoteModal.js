import React from 'react';

export const proposalModalRef = React.createRef();

export default {
    show: (...arg) => proposalModalRef.current.show(...arg),
    hide: () => proposalModalRef.current.hide(),
};
