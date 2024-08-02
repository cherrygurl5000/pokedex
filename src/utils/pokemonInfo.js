export async function getPokemon() {
  /*  
      https://pokeapi.co/docs/v2 for all info
      https://pokeapi.co/api/v2/pokemon-species/ditto/ for description
      https://github.com/veekun/pokedex/issues/218#issuecomment-339841781 for removing characters in description text
      https://pokeapi.co/api/v2/region/ for all regions 
      https://pokeapi.co/api/v2/pokemon-form/<pokemon name> or <pokemon id>
      https://pokeapi.co/api/v2/pokemon/{id or name}/encounters for pokemon encounters
      https://pokeapi.co/api/v2/evolution-chain/232/ for evolution, but isn't working properly
      https://img.pokemondb.net/artwork/${pokemonName}.jpg for images
      https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/025.png for images using 3 digit id
      https://pokeapi.co/api/v2/pokemon?offset=300&limit=1303
      
  */
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300')
    const data = await res.json()

    //console.log(allData)
    return await data
}

export async function getPokemonData(pokemonName) {
    // const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // const data1 = await res1.json()
    const data1 = await getBasics(pokemonName)
    // Find all relevant data and break it into more functional pieces
    const basic = await basicInfo(data1)

    // Get images based on the id
    const url = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${basic.fullId}.png`

    // Get the Pokemon regions from where they can be encountered
    const regions = await encounters(pokemonName)

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
    //console.log(basic, evo, fullDesc, regions)

    return {pokemonName, url, basic, evo, fullDesc, regions}
}

async function getBasics(pokemonName) {
    const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data1 = await res1.json()

    return await data1
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

    const fullId = await getFullId(id)

    return {fullId, metricHt, metricWt, imperialHt, imperialWt, jointType, jointMoves}
}

async function getFullId(id) {
    let fullId = id.toString()
    if (fullId.length === 1) fullId = "00" + fullId
    else if (fullId.length === 2) fullId = "0" + fullId

    return fullId
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

    // Get the urls for the evolutions from the 3-digit ids out of the basic info for each form
    let ids = []
    for (let i = 0; i < evo.length; i++) {
        if (evo[i] !== noEvo) {
            let tried = await getBasics(evo[i])
            let { id } = await tried
            id = await getFullId(id)
            ids.push(`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${id}.png`)
            //console.log({ tried, id, ids })
        }
    }

    return { evo, ids }
}

async function encounters(pokemonName) {
    // Get a list of all regions to compare to Pokemon encounters
    const regionRes = await fetch('https://pokeapi.co/api/v2/region/')
    const regionData = await regionRes.json()
    const regionArr = await regionData.results
    const regions = await regionArr.map(region => region.name)

    // Find the encounters of the pokemon and add the regions that it can be found in
    const pokeRegionRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`)
    const pokeRegionData = await pokeRegionRes.json()
    const pokeRegionArr = await pokeRegionData.map(region => region.location_area.name.split('-')[0])
    const firstWord = [...new Set(pokeRegionArr)]
    let matchedRegion = []
    for (let i = 0; i < regions.length; i++) {
        matchedRegion.push(firstWord.filter(region => region === regions[i]))
    }
    //let capitalRegion = matchedRegion.map(index => index.charAt(0).toUpperCase() + index.slice(1))
    let pokeRegion = matchedRegion.filter(region => region.length > 0)
    pokeRegion = pokeRegion.map(index => index[0].charAt(0).toUpperCase() + index[0].slice(1)).join().split(',')

    //console.log(pokeRegion)
    return pokeRegion
}

/* Sample Output
    data: Object { pokemonName: "charmander", url: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/004.png", fullDesc: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail. The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places. If it's healthy, the flame on the tip of its tail will burn vigor ously, even if it gets a bit wet. From the time it is born, a flame burns at the tip of its tail. Its life would end if the flame were to go out. It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.", … }
​​
basic: Object { fullId: "004", metricHt: "0.6 m", metricWt: "8.5 kg", … }
​​
evo: Object { evo: (3) […], ids: (3) […] }
​​
fullDesc: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail. The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places. If it's healthy, the flame on the tip of its tail will burn vigor ously, even if it gets a bit wet. From the time it is born, a flame burns at the tip of its tail. Its life would end if the flame were to go out. It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail."
​​
pokemonName: "charmander"
​​
regions: Array [ "Kanto", "Alola" ]
​​
url: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/004.png"
 */