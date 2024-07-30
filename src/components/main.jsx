import React, { Component } from 'react'
import { getPokemon } from '../utils/pokemonInfo';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import 'bootstrap/dist/css/bootstrap.css'

class MainSection extends Component {
    state = { 
        list: [
            {name: "anything"}
        ],
        pageSize: 4,
        currentPage: 1,
    } 
    componentDidMount() {
        this.handleGetPokemon()
    }
    render() { 
        // For pagination, we need the pageSize, the currentPage, the totalCount, and the list of Pokemon characters
        const { pageSize, currentPage } = this.state
        const { totalCount, pokemonList } = this.getPageData(this.state.list, currentPage, pageSize)
        
        return (
            <>
                <ul>
                    {this.handleList(pokemonList)}
                </ul>
                <Pagination itemsCount={totalCount} pageSize={pageSize} onPageChange={this.handlePageChange} currentPage={currentPage} />
            </>
        );
    }

    handleGetPokemon = async () => {
        // Pull in the Pokemon list
        const getList = await getPokemon()
        const list = await getList.results
        this.setState({list})
        //console.log(list)
        return await list
    }
    handleList = list => {
        // Create a list item for each pokemon in the list
        const listItems = list.map(item => <li key={item.name}>{item.name}</li>)
        return listItems
    }
    getPageData = (list, currentPage, pageSize) => {
        //const genreMovies = currentGenre !== 'allGenresId' ? movies.filter(movie => movie.genre._id === currentGenre) : movies
        //const sorted = _.orderBy(genreMovies, [sortColumn.column], [sortColumn.order])
        const pokemonList = paginate( list, currentPage, pageSize)

        return { totalCount: list.length, pokemonList }
    }
    handlePageChange = page => {
        this.setState({currentPage: page})
    }
}
 

export default MainSection;