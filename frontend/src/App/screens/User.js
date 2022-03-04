import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from "react-router-dom";

import { useAppContext } from '../../context/appContext'
import { Main } from '../../components/Main'
import { Title } from '../../components/Text'
import Loading from '../../components/Loading';
import PaginatedList from '../../components/PostList/PaginatedList';

const User = () => {
    const params = useParams()
    const { setLoading, contract, loading } = useAppContext()

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
            const _postCount = await contract.ownerToPostCount(params.userPublicKey)
            setPageCount(Math.ceil(_postCount / limit))
            const _posts = await contract.getPostsFromTheLatestFromOwner(params.userPublicKey, currentPage, limit)
            setPosts(_posts)
        } catch (error) {
            console.log("Error fetching data", { error })
        }
    }, [contract, currentPage, params.userPublicKey])

    useEffect(() => {
        if (!contract) return
        setLoading(true)
        loadDataFromBlockchain()
        setLoading(false)
    }, [setLoading, contract, currentPage, loadDataFromBlockchain])

    if (loading) {
        return (
            <Main><Loading /></Main>
        )
    }
    if (!posts) {
        return (
            <Main><Title>No posts yet</Title></Main>
        )
    }
    return (
        <Main>
            <Title>User {params.userPublicKey.slice(0, 20) + "..."}</Title>
            <PaginatedList posts={posts} pageCount={pageCount} handlePageClick={handlePageClick} />
        </Main>
    )
}

export default User