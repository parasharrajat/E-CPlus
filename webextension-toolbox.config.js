// This file does not going through babel transformation.
// So, we write it in vanilla JS
// (but you could use ES2015 features supported by your Node.js version).
const {resolve} = require('path') // eslint-disable-line @typescript-eslint/no-var-requires
const {ProvidePlugin} = require('webpack') // eslint-disable-line @typescript-eslint/no-var-requires
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin') // eslint-disable-line @typescript-eslint/no-var-requires
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin') // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
	webpack: (config) => {
		if (config.resolve.plugins) {
			config.resolve.plugins.push(new TsconfigPathsPlugin())
		} else {
			config.resolve.plugins = [new TsconfigPathsPlugin()]
		}

		config.plugins.push(
			new ProvidePlugin({
				browser: require.resolve('webextension-polyfill')
			})
		)
		// The webextension-polyill doesn't work well with webpacks ProvidePlugin.
		// So we need to monkey patch it on the fly
		// More info: https://github.com/mozilla/webextension-polyfill/pull/86
		config.module.rules.push({
			test: /webextension-polyfill[\\/]+dist[\\/]+browser-polyfill\.js$/,
			loader: require.resolve('string-replace-loader'),
			options: {
				search: 'typeof browser === "undefined"',
				replace: 'typeof window.browser === "undefined" || Object.getPrototypeOf(window.browser) !== Object.prototype'
			}
		});
		// Add typescript loader. Supports .ts and .tsx files as entry points.
		config.resolve.extensions.push('.ts', '.tsx')
		config.entry = GlobEntriesPlugin.getEntries(
		[
			resolve('app', '*.{js,mjs,jsx,ts,tsx}'),
			resolve('app', '?(scripts)/*.{js,mjs,jsx,ts,tsx}'),
		],
		{
			ignore: [
				'app/scripts/__tests__/*',
				'scripts/__tests__/*',
				'*/__tests__/*',
				'**/__tests__/*',
				'*/**/__tests__/*',
			]
		}
	)
		config.module.rules.push({
		test: /\.tsx?$/,
		loader: 'ts-loader',
		exclude: /node_modules|\.d\.ts$/
	})
		config.module.rules.push({
		test: /\.d\.ts$/,
		loader: 'ignore-loader'
	})
		config.module.rules.push({
		test: /\.css$/,
		use: [
			'style-loader',
			'css-loader',
		],
	})

		return config
},
}
