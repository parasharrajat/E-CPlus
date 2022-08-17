import React, {Component} from 'react';
import '../../styles/contentscript.css';
import {Box, NavList, Text} from '@primer/react';
import {BookIcon, ChecklistIcon, GearIcon} from '@primer/octicons-react';
import NotesPanel from '../components/NotesPanel';

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
            {
                key: 'checklist',
                title: 'Checklist',
                icon: ChecklistIcon,
            },
        ];
        this.globalNavs = [
            {
                key: 'settings',
                title: 'Settings',
                icon: GearIcon,
            },
        ];
    }

    componentWillUnmount() {
    }

    onNavClick = (e, nav) => {
        e.preventDefault();
        this.setState({panelVisible: true, panel: nav.key});
    };

    renderNav = (navKey) => {
        switch (navKey) {
        case 'notes': return <NotesPanel onClose={this.closePanel} />;
        default: break;
        }
    };

    closePanel = () => {
        this.setState({panel: '', panelVisible: false});
    };

    render() {
        return (
            <>
                <Box
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
                    <NavList sx={{
                        li: {
                            ml: 1,
                            mr: 1,
                            borderRadius: 0,
                            width: 'auto',
                        },
                    }}
                    >
                        {this.pageNavs.map((nav, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <NavList.Item key={`nav${index}`} href="#" sx={{px: 1}} onClick={(e) => this.onNavClick(e, nav)} className="sidebarRoot-nav">
                                <NavList.LeadingVisual sx={{height: 'auto'}}>
                                    <nav.icon size="small" />
                                </NavList.LeadingVisual>
                                <Text fontSize="small">{nav.title}</Text>
                            </NavList.Item>
                        ))}
                        <NavList.Divider />
                        {this.globalNavs.map((nav, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <NavList.Item key={`nav${index}`} href="#" sx={{px: 1}} onClick={(e) => this.onNavClick(e, nav)} className="sidebarRoot-nav">
                                <NavList.LeadingVisual sx={{height: 'auto'}}>
                                    <nav.icon size="small" />
                                </NavList.LeadingVisual>
                                <Text fontSize="small">{nav.title}</Text>
                            </NavList.Item>
                        ))}
                    </NavList>
                </Box>
                <Box
                    className={`sidebarRoot-panel ${this.state.panelVisible ? 'visible' : ''}`}
                    borderColor="border.default"
                    borderWidth={1}
                    borderRightWidth={0}
                    borderStyle="solid"
                    borderRadius={0}
                    width={410}
                    height="100%"
                    bg="canvas.default"
                >
                    {this.renderNav(this.state.panel)}
                </Box>
            </>
        );
    }
}

export default SidebarRoot;
