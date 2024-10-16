import React, { Component } from 'react'
import { getPokemon, getPokemonData } from '../utils/pokemonInfo'
import Pagination from './pagination'
import { paginate } from '../utils/paginate'
import _ from 'lodash'
import 'bootstrap/js/dist/modal'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import Card from './card'
import Modal from './modal'

class MainSection extends Component {
    state = { 
        list: [
            {name: ""}
        ],
        info: [],
        pageSize: 12,
        currentPage: 1,
    } 
    async componentDidMount() {
        // Pull in the pokemon data after the component mounts in order to ensure the info has a place to go
        const pokemonData = await this.handleGetPokemon()
        const { info } = pokemonData  
        
        return info
    }
    render() { 
        // For pagination, we need the pageSize, the currentPage, the totalCount, and the list of Pokemon characters
        const { pageSize, currentPage } = this.state
        const { totalCount, pokemonList } = this.getPageData(this.state.info, currentPage, pageSize)
        
        return (
            <>
                {/* <button type="button" data-toggle="modal" data-target="#poke">Press</button> */}
                <div className="row justify-content-center allCards">
                    {this.handleCards(pokemonList)}
                </div>
                <Pagination itemsCount={totalCount} pageSize={pageSize} onPageChange={this.handlePageChange} currentPage={currentPage} />
                {this.handleModals(pokemonList)}
                {/* <Modal data={'names'} /> */}
            </>
        );
    }

    handleGetPokemon = async () => {
        // Pull in the Pokemon list
        const getList = await getPokemon()
        const list = await getList.results
        this.setState({list})
        const info = await this.handleGetPokemonData(this.state.list)
        this.setState({info})
        return { info }
    }
    handleGetPokemonData = async (list) => {
        // Use the Pokemon list to get all of the data for each pokemon
        let info = []
        for (let i = 0; i < list.length; i++) {
            const fullList = await list[i]
            const listName = await fullList.name
            if (await listName !== '') {
                info.push(await getPokemonData(listName))
            }
        }
        return info
    }
    handleCards = info => {
        let cards = []
        for (let i = 0; i < info.length; i++) {
            cards.push( <Card key={info[i].basic.fullId} data={info[i]} />)
        }
        return cards        
    }
    handleList = list => {
        // Create a list item for each pokemon in the list
        const listItems = list.map(item => <li key={item.name}>{item.name}</li>)
        return listItems
    }
    getPageData = (list, currentPage, pageSize) => {
        const sorted = _.orderBy(list, 'pokemonName', 'asc')
        const pokemonList = paginate(sorted, currentPage, pageSize)
        

        return { totalCount: list.length, pokemonList }
    }
    handlePageChange = page => {
        this.setState({currentPage: page})
    }
    handleModals = info => {
        let modals = []
        for (let i = 0; i < info.length; i++) {
            modals.push( <Modal key={info[i].basic.fullId+"modal"} data={info[i]} />)
        }
        return modals   
    }
}
 

export default MainSection;