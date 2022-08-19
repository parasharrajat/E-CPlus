import React from 'react';
import {XIcon} from '@primer/octicons-react';
import {IconButton} from '@primer/react';

function CloseButton(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <IconButton sx={{bg: 'transparent !important'}} icon={XIcon} {...props} />;
}
export default CloseButton;
