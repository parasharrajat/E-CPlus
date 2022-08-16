import React, {Component} from "react";
import {ThemeProvider} from "@primer/react";

export default class DomRoot extends Component {
    render() {
        return (
            <ThemeProvider>
                {this.props.children}
            </ThemeProvider>
        );
    }
}
