import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';

import routes from './routes';
import renderFullPage from './render-full-page';
import getPokemon from './pokemon';
import App from '../components/App';

export default (request, response) => {
    const match = routes.reduce((acc, route) => {
        return matchPath(request.url, { path: route, exact: true }) || acc;
    }, null);
    console.log('match', match);

    if (!match) {
        response.status(404).send("Page not found");
        return;
    }

    return getPokemon.withAbility("telepathy")
        .then(({ pokemon }) => {
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
