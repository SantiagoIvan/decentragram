import React from 'react'
import { utils } from 'ethers'

import { useModalContext } from '../../context/modalContext'
import { useAppContext } from '../../context/appContext'
import { CustomLink, TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription } from './PostElements'
import { PrimaryButton } from '../Button'
import { Text } from '../Text'

// [TODO] cambiar el Custom Link para que vaya al perfil del usuario

const Post = ({ post }) => {
    const { setTipModalOpen, setPost, setImageModalOpen } = useModalContext()
    const { account, setLoading, contract, provider } = useAppContext()

    const handleTipButton = () => {
        setPost(post)
        setTipModalOpen(true)
    }

    const handleImageClick = () => {
        setPost(post)
        setImageModalOpen(true)
    }

    const handleWithdrawTipsClick = async () => {
        try {
            setLoading(true)

            const signer = await provider.getSigner()
            const tx = await contract.populateTransaction.withdrawTips(post.id)
            const execTx = await signer.sendTransaction({ ...tx })
            await provider.waitForTransaction(execTx.hash)
            alert("Done!")
        } catch (error) {
            console.log("Error withdraing tips. ", { error })
        } finally {
            setLoading(false)
        }
    }

    return (
        <PostContainer>
            <AvatarContainer>
                <CustomLink to={`/users/${post.owner}`}>
                    <Avatar seed={post.owner.toLowerCase()} />
                </CustomLink>
                <PostTitle>{post.owner.toString().slice(0, 20) + "..."}</PostTitle>
            </AvatarContainer>
            <ImageContainer>
                <PostImage src={process.env.REACT_APP_IPFS_BASE_URL + post.path} onClick={handleImageClick} />
                <PostDescription >{post.description}</PostDescription>
            </ImageContainer>
            <TipButtonContainer>
                {account && post.owner.toLowerCase() !== account.toLowerCase() ?
                    <PrimaryButton onClick={handleTipButton}>+ Tip</PrimaryButton> :
                    <>
                        <PrimaryButton disabled={utils.formatEther(post.tips) === "0.0"} onClick={handleWithdrawTipsClick}>Withdraw</PrimaryButton>
                        <Text>$ {utils.formatEther(post.tips)}</Text>
                    </>
                }
                <Text>Total $ {utils.formatEther(post.totalTipsReceived)}</Text>
            </TipButtonContainer>
        </PostContainer >
    )
}

export default Post