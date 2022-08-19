import {Box, Text} from '@primer/react';
import {element, string} from 'prop-types';
import React from 'react';

const propTypes = {
    title: string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    icon: element.isRequired,
};

function EmptyContent(props) {
    return (
        <Box display="flex" flexDirection="column" height="100%" justifyContent="center" alignItems="center" p={2} color="fg.subtle">
            <props.icon size={60} />
            <Text fontSize={1} fontWeight={300}>{props.title}</Text>
        </Box>
    );
}

EmptyContent.propTypes = propTypes;
export default EmptyContent;
