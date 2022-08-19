// This file does not going through babel transformation.
// So, we write it in vanilla JS
// (but you could use ES2015 features supported by your Node.js version).
module.exports = {
    webpack: (config) => {
        // eslint-disable-next-line no-param-reassign
        // config.entry = GlobEntriesPlugin.getEntries(
        //     [
        //         resolve('app', '*.{js,mjs,jsx,ts,tsx}'),
        //         resolve('app', '?(scripts)/*.{js,mjs,jsx,ts,tsx}'),
        //     ],
        //     {
        //         ignore: [
        //             'app/scripts/__tests__/*',
        //             'scripts/__tests__/*',
        //             '*/__tests__/*',
        //             '**/__tests__/*',
        //             '*/**/__tests__/*',
        //         ],
        //     },
        // );
        config.module.rules.push({
            test: /\.d\.ts$/,
            loader: 'ignore-loader',
        });
        config.module.rules.push({
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        });

        return config;
    },
};
