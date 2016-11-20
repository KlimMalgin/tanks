var path = require('path');
var pkg = require('./package.json');

module.exports = {
    entry: "./app/index.js",
    output: {
        path: path.resolve(pkg.config.buildDir),
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, exclude: /node_modules/, loader: "json" },
            { test: /\.json$/, include: path.join(__dirname, 'node_modules', 'pixi.js'), loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
