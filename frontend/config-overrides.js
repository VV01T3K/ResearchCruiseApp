const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function override(config) {
    config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, 'tsconfig.json'),
        }),

    ];
    console.log(config.resolve.plugins);

    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];

    return config;
};