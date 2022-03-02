import React, { useCallback, useEffect, useState } from 'react'
import { IconContext } from 'react-icons'

import { Main } from '../../components/Main'
import { Title } from '../../components/Text'
import PaginatedList from '../../components/PostList/PaginatedList'
import Loading from '../../components/Loading'
import { NewPostButton } from '../../components/Button'

import { useAppContext } from '../../context/appContext'
import { useModalContext } from '../../context/modalContext'

const Home = () => {
    const { loading, setLoading, contract } = useAppContext()
    const { setNewPostModalOpen } = useModalContext()

    //paginacion
    const [posts, setPosts] = useState()
    const [pageCount, setPageCount] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1)
    }

    //Data Loader
    const loadDataFromBlockchain = useCallback(async () => {
        try {
            const _postCount = await contract.postCount()
            setPageCount(Math.ceil(_postCount / limit))
            const _posts = await contract.getPosts(currentPage, limit)
            setPosts(_posts)
        } catch (error) {
            console.log("Error fetching data", { error })
        }
    }, [contract, currentPage])

    useEffect(() => {
        if (!contract) return
        setLoading(true)
        loadDataFromBlockchain()
        setLoading(false)
    }, [setLoading, contract, currentPage, loadDataFromBlockchain])


    //NewPost
    const handleNewPostButton = () => {
        setNewPostModalOpen(true)
    }

    if (loading) {
        return <Main><Loading /></Main>
    }
    if (!loading && !posts) {
        return <Main><Title>We have no posts yet :(</Title></Main>
    }
    return (
        <Main>
            <Title>Decentragram</Title>
            <IconContext.Provider value={{ style: { height: "3rem", width: "3rem" } }}>
                <NewPostButton onClick={handleNewPostButton} />
            </IconContext.Provider>
            <PaginatedList posts={posts} pageCount={pageCount} handlePageClick={handlePageClick} />
        </Main>
    )
}

export default Home