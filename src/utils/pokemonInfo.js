export async function getPokemon() {
  /*  
      https://pokeapi.co/docs/v2 for all info
      https://pokeapi.co/api/v2/pokemon-species/ditto/ for description
      https://github.com/veekun/pokedex/issues/218#issuecomment-339841781 for removing characters in description text
      https://pokeapi.co/api/v2/region/ for all regions 
      https://pokeapi.co/api/v2/pokemon-form/<pokemon name> or <pokemon id>
      https://pokeapi.co/api/v2/evolution-chain/232/ for evolution, but isn't working properly
      https://pokeapi.co/api/v2/pokemon?offset=300&limit=1303
      
  */
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
  const data = await res.json()

    //console.log(data)
    return await data
}

//getPokemon();