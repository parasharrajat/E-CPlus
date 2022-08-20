import {KebabHorizontalIcon} from '@primer/octicons-react';
import {element, func, string} from 'prop-types';
import React, {Component} from 'react';
import Helper from '../lib/Helper';

const propTypes = {
    fallback: element,
    link: string.isRequired,
    children: func.isRequired,
};
const defaultProps = {
    fallback: <KebabHorizontalIcon size={16} />,
};

class TitleLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    componentDidMount() {
        Helper.getGhTitle(this.props.link).then((title) => this.setState({title, loaded: true}));
    }

    render() {
        if (!this.state.loaded) {
            return this.props.fallback;
        }

        return this.props.children(this.state.title);
    }
}

TitleLoader.propTypes = propTypes;
TitleLoader.defaultProps = defaultProps;

export default TitleLoader;
