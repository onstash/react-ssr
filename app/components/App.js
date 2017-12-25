import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import List from './list';
import Home from './home';

export default ({ pokemon }) => {
    return (
        <div>
            Your React Node app is set!
            <Switch>
                <Route path="/" exact component={Home} />
                <Route
                    path="/pokemon"
                    exact
                    render={() => <Redirect to="/pokemon/ability/telepathy" />}
                />
                <Route
                    path="/pokemon/ability/:ability"
                    render={location => <List pokemon={pokemon} location={location} />}
                />
            </Switch>
        </div>
    );
};
