import React from 'react'

import { TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription, btnContainer } from './PostElements'
import { TipButton } from '../Button'
const Post = ({ post }) => {
    return (
        <PostContainer>
            <AvatarContainer>
                <Avatar src="instagram-logo.svg" />
                <PostTitle>{post.owner.slice(20) + "..."}</PostTitle>
            </AvatarContainer>
            <ImageContainer>
                <PostImage src="instagram.png" />
                <PostDescription>{post.description}</PostDescription>
            </ImageContainer>
            <TipButtonContainer>
                <TipButton>+ Tip</TipButton>
            </TipButtonContainer>
        </PostContainer>
    )
}

export default Post