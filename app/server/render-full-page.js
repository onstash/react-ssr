import webpackAssets from '../../build/webpack-assets.json';
export default function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
        <head>
            <title>Your SSR React Router Node App initialised with data!</title>
        </head>
        <body>
            <div id="root">${html}</div>
            <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="/build/${webpackAssets.manifest.js}"></script>
            <script src="/build/${webpackAssets.vendor.js}"></script>
            <script src="/build/${webpackAssets.app.js}"></script>
        </body>
        </html>
    `
};
