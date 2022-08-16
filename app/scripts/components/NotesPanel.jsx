import React, {Component} from 'react';
import {
    Text, Box, Header, IconButton,
} from '@primer/react';
import {BookIcon, XIcon} from '@primer/octicons-react';
import {getProposalComments} from '../actions/issue';

export default class NotesPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: {},
        };
    }

    componentDidMount() {
        getProposalComments().then((notes) => this.setState({notes}));
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
                <Box p={3}>
                    {Object.values(this.state.notes).map((note) => (
                        <Box p={3}>{JSON.stringify(note)}</Box>
                    ))}
                </Box>
            </>
        );
    }
}
