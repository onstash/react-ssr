import React from 'react';

function List({ pokemon, location }) {
    const { ability } = location.match.params;
    return (
        <div>
            <h3>{ability}</h3>
            <ul>
                { pokemon.map(({ pokemon: _pokemon }) => {
                    return <li key={_pokemon.name}>{_pokemon.name}</li>
                })}
            </ul>
        </div>
    );
};

export default List;
