import React from 'react'

import { CustomLink, TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription, btnContainer } from './PostElements'
import { TipButton } from '../Button'


// [TODO] cambiar el Custom Link para que vaya al perfil del usuario


const Post = ({ post }) => {
    return (
        <PostContainer>
            <AvatarContainer>
                <CustomLink to="/">
                    <Avatar src="instagram-logo.svg" />
                </CustomLink>
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