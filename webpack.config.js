var path = require('path');

module.exports = {
    entry: './app/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devServer: {
        publicPath: '/dist/'
    }
};