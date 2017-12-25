import babelPlugin from "rollup-plugin-babel";
import commonJSPlugin from "rollup-plugin-commonjs";
import uglifyPlugin from "rollup-plugin-uglify";
import jsonPlugin from "rollup-plugin-json";

export default {
    input: "app/server/index.js",
    output: {
        file: "build/server.min.js",
        format: "cjs"
    },
    plugins: [
        jsonPlugin(),
        babelPlugin({ exclude: "node_modules/**" }),
        commonJSPlugin(),
        uglifyPlugin()
    ],
    external: [
        "path",
        "express",
        "react",
        "react-dom/server",
        "react-router-dom",
        "cors",
        "isomorphic-fetch"
    ]
};
