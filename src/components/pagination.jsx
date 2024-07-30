import React, { Component } from 'react'
import _ from 'lodash'
class Pagination extends Component {
    render() { 
        const { itemsCount, pageSize, onPageChange, currentPage } = this.props

        const pagesCount = Math.ceil(itemsCount / pageSize)
        if (pagesCount === 1) return null
        const pages = _.range(1, pagesCount + 1)
        return (
            <nav aria-label="Pokemon Pagination" className="mt-2">
                <ul className="pagination">
                    {pages.map(page => (
                        <li className={ page === currentPage ? 'page-item active' : 'page-item'} key={page}>
                            <a className="page-link" onClick={() => onPageChange(page)}>{page}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}
 
export default Pagination;