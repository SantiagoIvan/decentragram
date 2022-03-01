import React from 'react'

import { SecondaryTitle } from '../Text'
import Post from '../Post'
import { ListContainer } from './ListContainer'

const PostList = ({ posts }) => {

    return (
        <>
            <ListContainer>
                {!posts.length ? <SecondaryTitle>No posts to show</SecondaryTitle> :
                    posts.map(post => <Post key={post.id} post={post} />)
                }
            </ListContainer>
        </>
    )
}

export default PostList