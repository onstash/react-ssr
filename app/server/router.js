import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';

import routes from './routes';
import renderFullPage from './render-full-page';
import getPokemon from './pokemon';
import App from '../components/App';

export default (request, response) => {
    console.log(new Date(), 'request.url', request.url);
    const match = routes.reduce((acc, route) => {
        return matchPath(request.url, { path: route, exact: true }) || acc;
    }, null);
    console.log(new Date(), 'match', match);

    if (!match) {
        console.log(new Date(), 'match', "Page not found");
        response.status(404).send("Page not found");
        return;
    }

    if (request.url === "/") {
        const pokemon = {};
        const stream = renderToNodeStream(
            <StaticRouter context={{}} location={request.url}>
                <App pokemon={pokemon} />
            </StaticRouter>
        );
        let html = "";
        stream.on("data", data => {
            html += data;
        });
        stream.on("end", () => {
            console.log(new Date(), "renderToNodeStream end");
            response.status(200).end(renderFullPage(html, pokemon));
        });
        return;
    }

    console.log(new Date(), "Fetching pokemon");
    return getPokemon.withAbility("telepathy")
        .then(({ pokemon }) => {
            console.log(new Date(), "renderToNodeStream start");
            const stream = renderToNodeStream(
                <StaticRouter context={{}} location={request.url}>
                    <App pokemon={pokemon} />
                </StaticRouter>
            );
            let html = "";
            stream.on("data", data => {
                html += data;
            });
            stream.on("end", () => {
                console.log(new Date(), "renderToNodeStream end");
                response.status(200).end(renderFullPage(html, pokemon));
            });
        })
        .catch(error => {
            console.error(error);
            response
                .status(404)
                .end(`${error} - Oh no! I cannot find the telepathic pokemon... maybe they knew we were coming!`);
        });
};
