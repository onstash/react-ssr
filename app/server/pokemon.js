import "isomorphic-fetch";

const baseUrl = 'http://pokeapi.co/api/v2/ability';

const getPokemon = {
    withAbility: ability => {
        return fetch(`${baseUrl}/${ability}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.text())
        .then(response => {
            try {
                return JSON.parse(response);
            } catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        });
    }
};

export default getPokemon;
