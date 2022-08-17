import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text, Box, Header, IconButton, ActionList, Label, CircleBadge, themeGet, Avatar,
} from '@primer/react';
import {
    BookIcon, XIcon, PersonIcon, ArrowRightIcon,
} from '@primer/octicons-react';
import WithStorage from './WithStorage';
import {parseCommentURL, STORAGE_KEYS} from '../actions/common';
import TitleLoader from './TitleLoader';

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
                <Box p={3} overflowY="auto" overflowX="hidden" height="100%">
                    {this.props.notes.map((note, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Box key={`note_${index}`} bg="sponsors.subtle" borderRadius={2} className="notespanel-note" mb={3}>
                            <ActionList.LinkItem sx={{width: 'auto', position: 'relative'}} href={note.link}>
                                <Text fontSize="small">
                                    Note
                                    {' #'}
                                    {index + 1}
                                </Text>
                                <ActionList.Description variant="block" sx={{fontWeight: 'bold'}}>
                                    <TitleLoader link={note.link}>
                                        {(title) => title}
                                    </TitleLoader>
                                </ActionList.Description>
                                <CircleBadge sx={{backgroundColor: 'palevioletred'}} variant="small" size={32} className="icon-go">
                                    <CircleBadge.Icon icon={ArrowRightIcon} />
                                </CircleBadge>
                            </ActionList.LinkItem>
                            <Box px={2} flexDirection="row" display="flex">
                                <Label>
                                    <Avatar src={note.userAvatar} size={16} sx={{mr: 1}} />
                                    {'  '}
                                    {note.userHandle}
                                </Label>
                                <Label sx={{ml: 1}}>
                                    #
                                    {parseCommentURL(note.link).issueID}
                                </Label>
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
