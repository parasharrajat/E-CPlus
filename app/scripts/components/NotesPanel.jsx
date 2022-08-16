import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text, Box, Header, IconButton, ActionList, Label, CircleBadge,
} from '@primer/react';
import {
    BookIcon, XIcon, PersonIcon, ArrowRightIcon,
} from '@primer/octicons-react';
import WithStorage from './WithStorage';
import {STORAGE_KEYS} from '../actions/common';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    notes: PropTypes.arrayOf(PropTypes.any),
};

const defaultProps = {
    notes: [],
};
class NotesPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        console.debug(this.props.notes);
        return (
            <>
                <Header sx={{px: 3, py: 2}}>
                    <Header.Item>
                        <BookIcon size={34} />
                        <Text ml={2} fontSize="fontSizes[4]">Notes</Text>
                    </Header.Item>
                    <Box sx={{display: 'flex', flex: 1}} />
                    <IconButton variant="default" sx={{background: 'transparent'}} icon={XIcon} size="large" onClick={this.props.onClose} />
                </Header>
                <Box p={3}>
                    {this.props.notes.map((note, index) => (
                        <Box bg="canvas.subtle" borderRadius={2} className="notespanel-note">
                            <ActionList.LinkItem sx={{width: 'auto', position: 'relative'}} href={note.link}>
                                Note#
                                {index + 1}
                                <ActionList.Description variant="block">{note.link}</ActionList.Description>
                                <CircleBadge sx={{backgroundColor: 'palevioletred'}} variant="small" size={32} className="icon-go">
                                    <CircleBadge.Icon icon={ArrowRightIcon} />
                                </CircleBadge>
                            </ActionList.LinkItem>
                            <Box px={2}>
                                <PersonIcon size={16} />
                                <Label sx={{pl: 1}}>Default</Label>
                            </Box>
                            <Box py={2} px={3}>
                                {note.note}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </>
        );
    }
}

NotesPanel.propTypes = propTypes;
NotesPanel.defaultProps = defaultProps;

export default WithStorage({
    notes: {
        key: STORAGE_KEYS.NOTE,
    },
})(NotesPanel);
