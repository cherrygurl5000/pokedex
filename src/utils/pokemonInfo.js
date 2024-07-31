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

export async function getPokemonData(pokemonName) {
    const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data1 = await res1.json()

    // Get the evolution chain using the Pokemon name
    const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    const data2 = await res2.json()
    // Get all of the description entries
    const desc = await data2.flavor_text_entries //.filter(lang => lang.language === 'en')
    // Filter out all descriptions not in english and pass it to the description function
    // to get rid of unnecessary characters and create a single paragraph
    const descLang = await desc.filter(i => i.language.name === 'en')
    const descText = await descLang.map(i => i=i.flavor_text)
    const fullDesc = await description(descText)

    // Find the evolution chain url then get each form
    const evoChainUrl = await data2.evolution_chain.url
    const evoRes = await fetch(evoChainUrl)
    const evoData = await evoRes.json()

    // const evoFrom = await evoData.chain.species.name
    // Determine the evolution forms and add them to an array
    // const evoMid = await evoData.chain.evolves_to[0].species
    // const evoTo = await evoData.chain.evolves_to[0].evolves_to[0].species
    // Add try catch for evolutions in case there are none 
    let evoFrom, evoMid, evoTo
    try {
        evoFrom = await evoData.chain.species.name
    }
    catch (err) {
        // console.log(err)
        evoFrom = 'No  Orig Evolution'
    }
    try {
        evoMid = await evoData.chain.evolves_to[0].species.name
    }
    catch (err) {
        // console.log(err)
        evoMid = 'No Mid Evolution'
    }
    try {
        evoTo = await evoData.chain.evolves_to[0].evolves_to[0].species.name
    }
    catch (err) {
        // console.log(err)
        evoTo = 'No Final Evolution'
    }

    //console.log( data2, desc, evoFrom, evoMid, evoTo)
    //console.log(fullDesc)

    return {evoFrom, evoTo, evoMid, fullDesc}
}

async function description(arr) {
    let myArr = [...arr]
    let descArr = []
    // get the first word of each array description and remove all duplicates
    let firstWord = arr.map(i => i = i.split(' ')[0].toLowerCase())
    firstWord = [...new Set(firstWord)]
    //console.log(arr, firstWord)
    // remove every instance in the array that starts with the same word     
    let i = 0 
    while (descArr.length !== firstWord.length) {   
        descArr.push(myArr[0])
        myArr = myArr.filter(j => j.split(' ')[0].toLowerCase() !== firstWord[i])
        //console.log(firstWord, descArr, myArr, i)
        i++
    }
    //console.log(descArr)
    for (let i = 0; i < descArr.length; i++) {
        descArr[i] = descArr[i].replaceAll('\n', ' ')
                                .replaceAll('\u000c', ' ')
                                .replaceAll('\f', '\n')
                                .replaceAll('\u00ad\n', '')
                                .replaceAll('\u00ad', '')
                                .replaceAll(' -\n', ' - ')
                                .replaceAll('-\n', '-')
                                .replaceAll('\n', ' ')
    }
    let fullDesc = descArr.join(' ')
    //console.log(fullDesc)
    return fullDesc

}

getPokemonData('flaaffy')
// getPokemonData('mareep')
// getPokemonData('shinx')
// getPokemonData('luxio')
// getPokemonData('lunatone')
// getPokemonData('lurantis')
// //getPokemon();