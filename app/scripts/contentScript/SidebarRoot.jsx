import {CopilotIcon} from '@primer/octicons-react';
import {
    ActionList,
    ActionMenu,
    Avatar,
    Box,
    CounterLabel,
    NavList,
    Overlay,
    Portal,
    Text,
    themeGet,
} from '@primer/react';
import {any} from 'prop-types';
import React, {Component, createRef, Fragment} from 'react';
import browser from 'webextension-polyfill';
import {STORAGE_KEYS} from '../actions/common';
import settings from '../actions/settings';
import ChecklistPanel from '../components/ChecklistPanel';
import NotesPanel from '../components/NotesPanel';
import SettingsPanel from '../components/SettingsPanel';
import WithStorage from '../components/WithStorage';
import Helper from '../lib/Helper';
import Navigation from '../lib/Navigation';
import Session from '../lib/Session';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    settings: any,
};

const defaultProps = {
    settings: {
        checklists: [],
        checklistRules: [],
    },
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
                icon: Helper.getAsset('images/notes.png'),
            },
            {
                key: 'checklist',
                title: 'Checklist',
                icon: Helper.getAsset('images/checklist.png'),
            },
        ];
        this.globalNavs = [
            {
                key: 'settings',
                title: 'Settings',
                icon: Helper.getAsset('images/settings.png'),
            },
        ];
        const pageType = Helper.getPageType();
        if (!pageType.includes('list')) {
            this.globalNavs.push({
                key: 'c+view',
                title: 'C+ View',
                icon: CopilotIcon,
            });
        }

        this.specialCPlusLinks = Helper.getCPlusSpecialLinks();
    }

    componentDidMount() {
        if (!Session.isUserSessionActive()) {
            return;
        }
        this.attachSpecialCPlusMenus();
        this.setActiveSpecialLinkTitle();
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
                return <SettingsPanel onClose={this.closePanel} />;
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
                nav.key === 'c+view' && this.props.settings?.cPlusView ? 'active' : ''
            }`}
        >
            <NavList.LeadingVisual sx={{height: 'auto', m: 0, maxWidth: 'auto'}}>
                {typeof nav.icon === 'string' ? (
                    <Avatar src={nav.icon} square size={32} />
                ) : (
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

    showCommonSpecialMenu = (e, type, ref) => {
        e.preventDefault();
        this.setState({
            isSpecialMenuOpen: true, menuType: type, menuAnchorRef: ref,
        });
    };

    setActiveSpecialLinkTitle = () => {
        const activeSpecialLink = this.specialCPlusLinks.find((linkDetails) => linkDetails.url.toLowerCase() === window.location.href.toLowerCase());
        if (!activeSpecialLink) {
            return;
        }
        const anchorId = activeSpecialLink.type === 'issue' ? '#issues-tab' : '#pull-requests-tab';
        const anchor = document.querySelector(anchorId);
        const contentEl = anchor.querySelector('[data-content]');
        const counterEl = anchor.querySelector('.Counter');
        if (contentEl) {
            contentEl.textContent = activeSpecialLink.title;
        }
        if (counterEl) {
            counterEl.hidden = true;
        }
    };

    hideCommonSpecialMenu = () => {
        this.setState({isSpecialMenuOpen: false, menuType: null, menuAnchorRef: null});
    };

    attachSpecialCPlusMenus = () => {
        const anchors = ['#issues-tab', '#pull-requests-tab'];
        anchors.forEach((anchorId) => {
            const anchor = document.querySelector(anchorId);
            const contentEl = anchor.querySelector('[data-content]');
            const counterEl = anchor.querySelector('.Counter');
            this.specialCPlusLinks.unshift({
                title: contentEl.textContent,
                type: anchor.id.includes('issue') ? 'issue' : 'pull',
                url: anchor.getAttribute('href'),
                counter: counterEl?.textContent,
                isMain: true,
            });
            anchor.addEventListener('click', (e) => {
                const ref = createRef();
                ref.current = e.target;
                this.showCommonSpecialMenu(e, e.target.id.includes('issue') ? 'issue' : 'pull', ref);
            });
        });
    };

    getSpecialLinkMainItemContent = (linkDetails) => {
        if (!linkDetails) {
            return null;
        }
        return (
            <>
                <Text fontWeight="bold">{linkDetails.title}</Text>
                <CounterLabel sx={{ml: 2}}>{linkDetails.counter}</CounterLabel>
            </>
        );
    };

    render() {
        if (this.globalNavs[1]) {
            this.globalNavs[1].icon = this.props.settings?.cPlusView
                ? Helper.getAsset('images/optimus-prime.png')
                : CopilotIcon;
        }
        return (
            <>
                <ActionMenu open={this.state.isSpecialMenuOpen} onOpenChange={this.hideCommonSpecialMenu} anchorRef={this.state.menuAnchorRef}>
                    <ActionMenu.Overlay width="medium" sx={{mt: 2}}>
                        <ActionList>
                            {this.specialCPlusLinks
                                .filter((linkdetails) => linkdetails.type === this.state.menuType)
                                .map((linkdetails, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Fragment key={`anchor-${index}`}>
                                        <ActionList.LinkItem href={linkdetails.url}>
                                            {linkdetails.isMain
                                                ? this.getSpecialLinkMainItemContent(linkdetails)
                                                : linkdetails.title}
                                        </ActionList.LinkItem>
                                        {linkdetails.isMain && <ActionList.Divider />}
                                    </Fragment>
                                ))}
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
                <Box
                    ref={(el) => (this.sidebarRef = el)}
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
                            <Avatar
                                size={32}
                                square
                                src={browser.runtime.getURL('images/icon-main.png')}
                            />
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
