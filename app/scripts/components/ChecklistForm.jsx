import React, {Component} from 'react';
import {any, func} from 'prop-types';
import {
    Box,
    FormControl,
    TextInput,
    Textarea,
    Button,
    Flash,
} from '@primer/react';
import BoxHeader from './BoxHeader';
import settings from '../actions/settings';
import Checklist from '../lib/Checklist';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    checklist: any.isRequired,
    hideCheckListForm: func.isRequired,
};

class ChecklistForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklistForm: props.checklist,
        };
    }

    saveCheckList = () => {
        const html = Checklist.parseChecklistMD(this.state.checklistForm.content);
        if (!this.state.checklistForm.name.trim() || !this.state.checklistForm.content.trim()) {
            this.setState({
                checklistFormError: 'Please fill all the fields.',
            });
            return;
        }

        if (!html.length) {
            this.setState({
                checklistFormError: 'Please provide valid MD style checklist.',
            });
            return;
        }
        if (this.props.checklist?.id) {
            settings.updateChecklist(this.props.checklist?.id, {...this.state.checklistForm, content: this.state.checklistForm.content});
        } else {
            settings.addChecklist({...this.state.checklistForm, content: this.state.checklistForm.content});
        }
        this.props.hideCheckListForm();
    };

    onChange = (field, value) => {
        this.setState((prevState) => ({
            checklistForm: {
                ...prevState.checklistForm,
                [field]: value,
            },
        }));
    };

    render() {
        return (
            <Box
                border={1}
                borderStyle="solid"
                borderColor="border.subtle"
                borderRadius={2}
            >
                <BoxHeader
                    title={this.props.checklist?.id ? 'Edit Checklist' : 'Add new'}
                    onCloseClick={this.props.hideCheckListForm}
                />
                {this.state.checklistFormError && (
                    <Flash
                        sx={{
                            borderRadius: 0, width: '100%', m: 0, p: 2,
                        }}
                        variant="danger"
                    >
                        {this.state.checklistFormError}
                    </Flash>
                )}
                <FormControl sx={{display: 'flex'}}>
                    <FormControl.Label visuallyHidden>Name</FormControl.Label>
                    <TextInput
                        placeholder="Name"
                        sx={{
                            borderInline: 0,
                            borderRadius: 0,
                            width: '100%',
                        }}
                        defaultValue={this.state.checklistForm?.name}
                        onChange={(e) => this.onChange('name', e.target.value)}
                    />
                </FormControl>
                <FormControl sx={{display: 'flex'}}>
                    <FormControl.Label visuallyHidden>Content</FormControl.Label>
                    <Textarea
                        sx={{
                            border: 'none !important',
                            boxShadow: 'none !important',
                            width: '100%',
                            ':focus': {
                                border: 'none !important',
                                boxShadow: 'none !important',
                            },
                        }}
                        defaultValue={this.state.checklistForm?.content}
                        onChange={(e) => this.onChange('content', e.target.value)}
                        resize="vertical"
                        placeholder="Add checklist here"
                    />
                </FormControl>
                <Box p={2}>
                    <Button sx={{width: '100%'}} onClick={this.saveCheckList}>
                        Save
                    </Button>
                </Box>
            </Box>
        );
    }
}

ChecklistForm.propTypes = propTypes;
export default ChecklistForm;
