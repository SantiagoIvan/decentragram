import React, { useEffect, useState } from 'react'

import { Main } from '../../components/Main'
import { Title } from '../../components/Text'
import PostList from '../../components/PostList'
import Loading from '../../components/Loading'

import { data } from '../../data'

const Home = () => {
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        console.log("Aca me traeria algunos posts")
        setPosts(data)
    }, [])

    if (!posts) {
        return <Main><Loading /></Main>
    }
    return (
        <Main>
            <Title>Welcome</Title>
            <PostList posts={posts} />
        </Main>
    )
}

export default Home