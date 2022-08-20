import React, {Component} from 'react';
import {
    Avatar,
    Box, NavList, Overlay, Portal, Text, themeGet,
} from '@primer/react';
import {
    CopilotIcon,
} from '@primer/octicons-react';
import {any} from 'prop-types';
import browser from 'webextension-polyfill';
import NotesPanel from '../components/NotesPanel';
import WithStorage from '../components/WithStorage';
import {STORAGE_KEYS} from '../actions/common';
import settings from '../actions/settings';
import SettingsPage from '../components/SettingsPage';
import ChecklistPanel from '../components/ChecklistPanel';
import helper from '../lib/helper';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    settings: any,
};

const defaultProps = {
    settings: {},
};
class SidebarRoot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelVisible: false,
        };
        this.pageNavs = [
            {
                key: 'notes',
                title: 'Notes',
                icon: helper.getAsset('images/notes.png'),
            },
            {
                key: 'checklist',
                title: 'Checklist',
                icon: helper.getAsset('images/checklist.png'),

            },
        ];
        this.globalNavs = [
            {
                key: 'settings',
                title: 'Settings',
                icon: helper.getAsset('images/settings.png'),
            },
            {
                key: 'c+view',
                title: 'C+ View',
                icon: CopilotIcon,
            },
        ];
    }

    componentWillUnmount() {}

    onNavClick = (e, nav) => {
        e.preventDefault();
        if (nav.key === 'c+view') {
            settings.toggleCPlusView(!this.props.settings?.cPlusView);
            return;
        }
        this.setState({panelVisible: true, panel: nav.key});
    };

    renderNavContent = (navKey) => {
        switch (navKey) {
        case 'notes':
            return <NotesPanel onClose={this.closePanel} />;
        case 'settings':
            return <SettingsPage onClose={this.closePanel} />;
        case 'checklist':
            return <ChecklistPanel onClose={this.closePanel} />;
        default:
            break;
        }
    };

    renderNavList = (list) => list.map((nav, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <NavList.Item
            // eslint-disable-next-line react/no-array-index-key
            key={`nav${index}`}
            href="#"
            onClick={(e) => this.onNavClick(e, nav)}
            sx={{
                px: 1,
                ...(nav.key === 'c+view'
    && this.props.settings?.cPlusView && {
                    // color: 'fg.onEmphasis',
                    bg: 'canvas.inset',
                    borderWidth: 0,
                    borderStyle: 'solid',
                    borderColor: 'sponsors.emphasis',
                }),
            }}
            className={`sidebarRoot-nav ${
                nav.key === 'c+view' && this.props.settings?.cPlusView
                    ? 'active'
                    : ''
            }`}
        >
            <NavList.LeadingVisual sx={{height: 'auto', m: 0, maxWidth: 'auto'}}>
                {typeof nav.icon === 'string'
                    ? (
                        <Avatar src={nav.icon} square size={32} />
                    )
                    : (
                        <nav.icon
                            size="small"
                            fill={
                                nav.key === 'c+view' && this.props.settings?.cPlusView
                                    ? themeGet('fg.onEmphasis')
                                    : undefined
                            }
                        />
                    )}
            </NavList.LeadingVisual>
            <Text fontSize="small">{nav.title}</Text>
        </NavList.Item>
    ));

    closePanel = () => {
        this.setState({panel: '', panelVisible: false});
    };

    render() {
        console.debug(this.props.settings?.checklists);
        this.globalNavs[1].icon = this.props.settings?.cPlusView ? helper.getAsset('images/optimus-prime.png') : CopilotIcon;
        return (
            <>
                <Box
                    ref={(el) => this.sidebarRef = el}
                    className="sidebarRoot-menu"
                    borderColor="border.default"
                    borderWidth={1}
                    borderRightWidth={0}
                    borderStyle="solid"
                    borderTopLeftRadius={2}
                    borderBottomLeftRadius={2}
                    bg="canvas.subtle"
                    boxShadow="shadow.medium"
                    sx
                >
                    <NavList
                        sx={{
                            li: {
                                ml: 1,
                                mr: 1,
                                borderRadius: 0,
                                width: 'auto',
                            },
                            'li:last-child': {
                                background: 'unset!important',
                                color: 'unset!important',
                                cursor: 'auto',
                            },
                        }}
                    >
                        {this.renderNavList(this.pageNavs)}
                        <NavList.Divider />
                        {this.renderNavList(this.globalNavs)}
                        <NavList.Item as="span" sx={{px: 1}} className="sidebarRoot-nav">
                            <Avatar size={32} square src={browser.runtime.getURL('images/icon-main.png')} />
                        </NavList.Item>
                    </NavList>
                </Box>
                <Portal>
                    {this.state.panelVisible && (
                        <Overlay
                            returnFocusRef={this.sidebarRef}
                            onEscape={this.closePanel}
                            onClickOutside={this.closePanel}
                            sx={{
                                zIndex: 100000000001,
                            }}
                        >
                            <Box
                                className={`sidebarRoot-panel ${
                                    this.state.panelVisible ? 'visible' : ''
                                }`}
                                borderColor="border.default"
                                borderWidth={1}
                                borderRightWidth={0}
                                borderStyle="solid"
                                borderRadius={0}
                                width={410}
                                height="100%"
                                bg="canvas.default"
                                display="flex"
                                flexDirection="column"
                                boxShadow="shadow.large"
                            >
                                {this.renderNavContent(this.state.panel)}
                            </Box>
                        </Overlay>
                    )}
                </Portal>
            </>
        );
    }
}

SidebarRoot.propTypes = propTypes;
SidebarRoot.defaultProps = defaultProps;

export default WithStorage({
    settings: {
        key: STORAGE_KEYS.SETTINGS,
    },
})(SidebarRoot);
