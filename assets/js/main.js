const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    // Formatar o número com 3 dígitos
    const formattedNumber = pokemon.number.padStart(3, '0');

    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${formattedNumber}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// To Do

document.addEventListener('click', (event) => {
    if (event.target.closest('.pokemon')) {
        const pokemonElement = event.target.closest('.pokemon');
        const pokemonData = {
            number: pokemonElement.querySelector('.number').textContent.trim().replace('#', '').padStart(3, '0'),
            name: pokemonElement.querySelector('.name').textContent.trim(),
            photo: pokemonElement.querySelector('img').src,
            types: [...pokemonElement.querySelectorAll('.type')].map(type => type.textContent.trim()),
        };

        // Constrói a URL com os dados do Pokémon
        const queryParams = new URLSearchParams({
            number: pokemonData.number,
            name: pokemonData.name,
            photo: pokemonData.photo,
            types: JSON.stringify(pokemonData.types), // Converte tipos para string JSON
        }).toString();

        window.location.href = `/pokemon-details.html?${queryParams}`;
    }
});

window.onload = function() {
    // Obtém a cor de fundo do header
    const headerBackgroundColor = window.getComputedStyle(document.querySelector('header')).backgroundColor;
  
    // Aplica a cor de fundo do header às divs de tipo de Pokémon
    const typeDivs = document.querySelectorAll('.type');
    typeDivs.forEach(function(div) {
      div.style.backgroundColor = headerBackgroundColor;
    });
};
