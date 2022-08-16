import React, {Component} from 'react';
import '../../styles/contentscript.css';
import {Box, NavList} from '@primer/react';
import {BookIcon, ChecklistIcon} from '@primer/octicons-react';
import NotesPanel from '../components/NotesPanel';

class SidebarRoot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelVisible: false,
        };
        this.navs = [
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
                        '> li': {
                            margin: 0,
                            borderRadius: 0,
                        },
                    }}
                    >
                        {this.navs.map((nav, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <NavList.Item key={`nav${index}`} href="#" onClick={(e) => this.onNavClick(e, nav)} className="sidebarRoot-nav">
                                <NavList.LeadingVisual sx={{height: 'auto'}}>
                                    <nav.icon size="medium" />
                                </NavList.LeadingVisual>
                                {nav.title}
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
