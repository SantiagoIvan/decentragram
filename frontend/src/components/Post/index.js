import React, { useRef, useState } from 'react'
import { BigNumber, utils } from 'ethers'

import { useAppContext } from '../../context/appContext'
import { CustomLink, TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription } from './PostElements'
import { PrimaryButton } from '../Button'
import Modal from '../Modal'
import { Input, Label } from '../Modal/ModalElements'
import { SecondaryTitle } from '../Text'

// [TODO] cambiar el Custom Link para que vaya al perfil del usuario

const Post = ({ post }) => {
    const [tipModalOpen, setTipModalOpen] = useState(false)
    const { provider, contract, setLoading } = useAppContext()
    const tipRef = useRef()

    const handleTipButton = () => {
        setTipModalOpen(true)
    }

    const handleTipSubmit = async () => {
        try {
            setTipModalOpen(false)
            setLoading(true)
            const parsedNumber = utils.parseEther(tipRef.current.value)
            // Ether -> Wei. Es decir, recibe un string representando una cantidad en Ether, y retorna
            // un BigNumber representando la misma cantidad en Wei

            const signer = await provider.getSigner()
            const _id = BigNumber.from(post.id)

            const tx = await contract.populateTransaction.tipPost(_id)
            const execTx = await signer.sendTransaction({ ...tx, "value": parsedNumber })
            await provider.waitForTransaction(execTx.hash)
        } catch (error) {
            alert("Transaction failed. Try again later")
            console.log("Error: ", { error })
        } finally {
            setLoading(false)
        }
    }

    /**
     * https://mui.com/components/transitions/#performance-amp-seo para el tema de que se desmonte todas las intancias
     * que no estan siendo mostradas onChange={(e) => setTipToSend(e.target.value)}
     */
    return (
        <PostContainer>
            <Modal header="Send some tips!" showModal={tipModalOpen} variant="tip" setModal={setTipModalOpen} >
                <form >
                    <Label htmlFor='amount'>Tips to send: </Label>
                    <Input type="text" name="amount" id="amount" ref={tipRef} />
                    <Input type="submit" onClick={handleTipSubmit} value="Send" />
                </form>
            </Modal>
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