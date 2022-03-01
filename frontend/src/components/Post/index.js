import React from 'react'
import { utils } from 'ethers'

import { useModalContext } from '../../context/modalContext'
import { CustomLink, TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription } from './PostElements'
import { PrimaryButton } from '../Button'
import { SecondaryTitle } from '../Text'

// [TODO] cambiar el Custom Link para que vaya al perfil del usuario

const Post = ({ post }) => {
    const { setTipModalOpen, setPost } = useModalContext()

    const handleTipButton = () => {
        setPost(post)
        setTipModalOpen(true)
    }

    /**
     * https://mui.com/components/transitions/#performance-amp-seo para el tema de que se desmonte todas las intancias
     * que no estan siendo mostradas onChange={(e) => setTipToSend(e.target.value)}
     */
    return (
        <PostContainer>
            <AvatarContainer>
                <CustomLink to="/">
                    <Avatar seed={post.owner.toLowerCase()} />
                </CustomLink>
                <PostTitle>{post.owner.toString().slice(0, 20) + "..."}</PostTitle>
            </AvatarContainer>
            <ImageContainer>
                <PostImage src={process.env.REACT_APP_IPFS_BASE_URL + post.path} />
                <PostDescription >{post.description}</PostDescription>
            </ImageContainer>
            <TipButtonContainer>
                <PrimaryButton onClick={handleTipButton}>+ Tip</PrimaryButton>
                <SecondaryTitle>Tips: {utils.formatEther(post.tips)}</SecondaryTitle>
            </TipButtonContainer>
        </PostContainer >
    )
}

export default Post