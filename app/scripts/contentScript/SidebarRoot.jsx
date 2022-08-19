import React, {Component} from 'react';
import {
    Avatar,
    Box, NavList, Overlay, Text, themeGet,
} from '@primer/react';
import {
    BookIcon,
    ChecklistIcon,
    GearIcon,
    CopilotIcon,
} from '@primer/octicons-react';
import {any} from 'prop-types';
import browser from 'webextension-polyfill';
import NotesPanel from '../components/NotesPanel';
import WithStorage from '../components/WithStorage';
import {STORAGE_KEYS} from '../actions/common';
import settings from '../actions/settings';
import {isDev} from '../lib/env';
import SettingsPage from '../components/SettingsPage';
import ChecklistPanel from '../components/ChecklistPanel';

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
                icon: BookIcon,
            },
        ];
        this.globalNavs = [
            {
                key: 'c+view',
                title: 'C+ View',
                icon: CopilotIcon,
            },
        ];

        if (isDev()) {
            this.pageNavs.push(
                {
                    key: 'checklist',
                    title: 'Checklist',
                    icon: ChecklistIcon,
                },
            );
            this.globalNavs.push({
                key: 'settings',
                title: 'Settings',
                icon: GearIcon,
            });
        }
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

    renderNav = (navKey) => {
        switch (navKey) {
        case 'notes':
            return <NotesPanel onClose={this.closePanel} />;
        case 'settings':
            return <SettingsPage onClose={this.closePanel} />;
        case 'checklist':
            return <ChecklistPanel onClose={this.closePanel} checklists={this.props.settings?.checklists} />;
        default:
            break;
        }
    };

    closePanel = () => {
        this.setState({panel: '', panelVisible: false});
    };

    render() {
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
                    bg="canvas.default"
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
                        {this.pageNavs.map((nav, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <NavList.Item
                                // eslint-disable-next-line react/no-array-index-key
                                key={`nav${index}`}
                                href="#"
                                sx={{px: 1}}
                                onClick={(e) => this.onNavClick(e, nav)}
                                className="sidebarRoot-nav"
                            >
                                <NavList.LeadingVisual sx={{height: 'auto', m: 0}}>
                                    <nav.icon size="small" />
                                </NavList.LeadingVisual>
                                <Text fontSize="small">{nav.title}</Text>
                            </NavList.Item>
                        ))}
                        <NavList.Divider />
                        {this.globalNavs.map((nav, index) => (
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
                                        bg: 'sponsors.emphasis',
                                        color: 'fg.onEmphasis',
                                        border: 'border.muted',
                                        borderColor: 'sponsors.muted',
                                    }),
                                }}
                                className={`sidebarRoot-nav ${
                                    nav.key === 'c+view' && this.props.settings?.cPlusView
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                <NavList.LeadingVisual sx={{height: 'auto', m: 0}}>
                                    <nav.icon
                                        size="small"
                                        fill={
                                            nav.key === 'c+view' && this.props.settings?.cPlusView
                                                ? themeGet('fg.onEmphasis')
                                                : undefined
                                        }
                                    />
                                </NavList.LeadingVisual>
                                <Text fontSize="small">{nav.title}</Text>
                            </NavList.Item>
                        ))}
                        <NavList.Item as="span" sx={{px: 1}} className="sidebarRoot-nav">
                            <Avatar size={32} square src={browser.runtime.getURL('images/icon-main.png')} />
                        </NavList.Item>
                    </NavList>
                </Box>
                {this.state.panelVisible && (
                    <Overlay
                        returnFocusRef={this.sidebarRef}
                        onEscape={this.closePanel}
                        onClickOutside={this.closePanel}
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
                        >
                            {this.renderNav(this.state.panel)}
                        </Box>
                    </Overlay>
                )}
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
