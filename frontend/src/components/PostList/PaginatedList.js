import React from 'react'
import ReactPaginate from 'react-paginate'
import PostList from '.'

const PaginatedList = ({ posts, handlePageClick, pageCount }) => {
    return (
        <>
            <PostList posts={posts} />
            <ReactPaginate
                previousLabel="<<"
                nextLabel=">>"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName='pagination justify-content: center' //https://getbootstrap.com/docs/5.1/components/pagination/
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                previousLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                activeClassName='active'
            />
        </>
    )
}

export default PaginatedList