module.exports = {
    entry: "./app/index.js",
    output: {
        path: "./build",
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
