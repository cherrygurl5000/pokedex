export async function getPokemon() {
  /*  
      https://pokeapi.co/docs/v2 for all info
      https://pokeapi.co/api/v2/pokemon-species/ditto/ for description
      https://github.com/veekun/pokedex/issues/218#issuecomment-339841781 for removing characters in description text
      https://pokeapi.co/api/v2/region/ for all regions 
      https://pokeapi.co/api/v2/pokemon-form/<pokemon name> or <pokemon id>
      https://pokeapi.co/api/v2/pokemon/{id or name}/encounters
      https://pokeapi.co/api/v2/evolution-chain/232/ for evolution, but isn't working properly
      https://img.pokemondb.net/artwork/${pokemonName}.jpg for images
      https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/025.png for images using 3 digit id
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

    // Find all relevant data and break it into more functional pieces
    const basic = await basicInfo(data1)

    // Get images based on the id
    const url = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${basic.fullId}.png`

    // Get the evolution chain using the Pokemon name
    const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    const data2 = await res2.json()

    // Get all of the description entries
    // Filter out all descriptions not in english and pass it to the description function
    // to get rid of unnecessary characters and create a single paragraph
    const desc = await data2.flavor_text_entries
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
    const evo = await evolution(evoFrom, evoMid, evoTo)
    //console.log( data2, desc, evoFrom, evoMid, evoTo)
    //console.log(basic)

    return {basic, evo, fullDesc}
}

async function basicInfo(basics) {
    const { id, height, moves, types, weight } = basics
    /* 
        Needed: imperial height (in ft and inches) and weight (in lbs)
                metric height (in m) and weight (in kg)
                all types joined by -
                all moves capitalized and joined by ,
                3-digit id
        */
    // metricHt, metricWt, imperialHt, imperialWt, jointType, jointMoves, fullId

    const metricHt = (height / 10).toString() + " m"

    const imperialHtFt = Math.trunc((height * 3.937007874) / 12).toString() + "\'"
    const imperialHtIn = Math.round((height * 3.937007874) % 12)
    const imperialHtInFormatted = (imperialHtIn < 10 ? "0" + imperialHtIn.toString() : imperialHtIn.toString()) + "\""
    const imperialHt = imperialHtFt + imperialHtInFormatted

    const metricWt = (weight / 10).toFixed(1).toString() + " kg"
    const imperialWt = (weight / 4.5359237).toFixed(1).toString() + " lbs"

    const allTypes = types.map(type => type.type.name.toLowerCase())
    const jointType = allTypes.map(index => index.charAt(0).toUpperCase() + index.slice(1)).join('-')

    const allMoves = moves.map(move => move.move.name.toLowerCase())
    const jointMoves = allMoves.map(index => index.charAt(0).toUpperCase() + index.slice(1)).join(', ')

    let fullId = id.toString()
    if (fullId.length == 1) fullId = "00" + fullId
    else if (fullId.length == 2) fullId = "0" + fullId

    // console.log(fullId)

    return {fullId, metricHt, metricWt, imperialHt, imperialWt, jointType, jointMoves}
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

async function evolution(start, middle, finish) {
    //console.log(start, middle, finish)
    let evo = []
    let noEvo = "Does not evolve"
    // Add the first evolution to the array
    // Filter out the additional evolutions if necessary
    evo.push(start)
    if (middle === "No Mid Evolution" && finish === "No Final Evolution") {
        evo.push(noEvo)
    }
    else if (middle === "No Mid Evolution") {
        evo.push(finish)
    }
    else if (finish === "No Final Evolution") {
        evo.push(middle)
    }
    else {
        evo.push(middle)
        evo.push(finish)
    }

    console.log(evo)
    return evo
}

getPokemonData('pikachu')
// getPokemonData('bulbasaur')
//  getPokemonData('electrode')
// getPokemonData('mareep')
// getPokemonData('shinx')
// getPokemonData('luxio')
// getPokemonData('lunatone')
// getPokemonData('lurantis')
// //getPokemon();