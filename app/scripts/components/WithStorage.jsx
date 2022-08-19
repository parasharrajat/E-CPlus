import React, {Component} from 'react';
import browser from 'webextension-polyfill';
import _ from 'underscore';
import storage from '../lib/storage';

export default function WithStorage(config) {
    const propNames = Object.keys(config);
    const storageKeysMap = {};

    return (WrappedComponent) => {
        const HOC = class extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    isReady: false,
                };
            }

            componentDidMount() {
                storage.isReady()
                    .then(this.getStoredValues)
                    .then(this.preparePropData)
                    .then((propData) => this.setState({propData, isReady: true}));
                browser.storage.onChanged.addListener(this.storageListener);
            }

            componentDidUpdate(prevProps) {
                if (!_.isEqual(prevProps, this.props)) {
                    this.getStoredValues()
                        .then(this.preparePropData)
                        .then((propData) => this.setState({propData}));
                }
            }

            componentWillUnmount() {
                browser.storage.onChanged.removeListener(this.storageListener);
            }

            getKey = (key) => {
                if (!key) {
                    return;
                }
                if (typeof key === 'function') {
                    return key(this.props)?.replace('*', '.*?');
                }
                return key.replace('*', '.*?');
            };

            getStoredValues = () => {
                propNames.forEach((propName) => {
                    const passedKey = this.getKey(config[propName].key);
                    if (!passedKey) {
                        return;
                    }
                    const matchedDataKeys = storage.getStoredKeys().filter((key) => key.match(new RegExp(passedKey)));
                    storageKeysMap[propName] = matchedDataKeys;
                });
                return browser.storage.local.get(Object.values(storageKeysMap).flat());
            };

            preparePropData = (values) => {
                const propData = {};
                Object.keys(storageKeysMap).forEach((propName) => {
                    propData[propName] = storageKeysMap[propName].length === 1 && storageKeysMap[propName][0] === this.getKey(config[propName].key)
                        ? values[storageKeysMap[propName][0]]
                        : storageKeysMap[propName].map((keyName) => values[keyName]);
                });
                return propData;
            };

            storageListener = (changes, area) => {
                if (area !== 'local') {
                    return;
                }
                const propDataChanged = Object.keys(changes).some((keyName) => propNames.some((propName) => {
                    const passedKey = this.getKey(config[propName].key);
                    if (!passedKey) {
                        return false;
                    }
                    return keyName.match(new RegExp(passedKey));
                }));
                if (!propDataChanged) {
                    return;
                }
                this.getStoredValues()
                    .then(this.preparePropData)
                    .then((propData) => this.setState({propData}));
            };

            render() {
                if (!this.state.isReady) {
                    return null;
                }
                // eslint-disable-next-line react/jsx-props-no-spreading
                return <WrappedComponent {...this.props} {...this.state.propData} />;
            }
        };

        return HOC;
    };
}
