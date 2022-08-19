import {Box, Text} from '@primer/react';
import {func, string} from 'prop-types';
import React from 'react';
import CloseButton from './CloseButton';

const propTypes = {
    title: string.isRequired,
    onCloseClick: func.isRequired,
};

function BoxHeader(props) {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
            <Text fontSize={2} fontWeight={600}>{props.title}</Text>
            <CloseButton onClick={props.onCloseClick} />
        </Box>
    );
}

BoxHeader.propTypes = propTypes;
export default BoxHeader;
