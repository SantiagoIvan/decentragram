import React, { useRef, useEffect, useState } from 'react'
import { utils } from 'ethers'

import { useModalContext } from '../../context/modalContext'
import { useAppContext } from '../../context/appContext'
import { CustomLink, TipButtonContainer, PostContainer, AvatarContainer, Avatar, PostTitle, ImageContainer, PostImage, PostDescription } from './PostElements'
import { PrimaryButton } from '../Button'
import { Text } from '../Text'

const Post = ({ post }) => {
    const { setTipModalOpen, setPost, setImageModalOpen } = useModalContext()
    const { account, setLoading, contract, provider } = useAppContext()
    const [show, setShow] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new window.IntersectionObserver((entries) => {
            const { isIntersecting } = entries[0]
            if (isIntersecting) {
                setShow(true)
                observer.disconnect()
            }
        })

        observer.observe(ref.current)
    }, [ref])

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
        <PostContainer ref={ref}>
            {show &&
                /**esta evaluacion la deberia hacer aca porque si la hago afuera retornando null, 
                 * estaria perdiendo la referencia
                 * A esto le falta una vueltita de tuerca. Como en un principio, no se mostraria hasta que este en la pantalla
                 * eso quiere decir que adentro de este contenedor no va a haber nada, por lo tanto su altura seria 0.
                 * Por lo tanto como la altura es 0, cuando cargue la pagina, van a estar todos los post container pegaditos
                 * porque su altura es 0.
                 * Por lo tanto, estar`an dentro del viewport, por lo tanto se van a mostrar, todos, all of them
                 * Para solucionar esto, tengo que ponerle una altura minima a cada PostContainer, para que cada uno
                 * de ellos ocupe un lugar fijo dentro de la pantalla por mas que no se tenga que mostrar.
                 * De esta forma, soluciono este problema de que si no tengo que mostrar el contenido, su altura sea 0 y quede arriba de todo
                 * 
                 * Hecho de esta forma, ahora cuando cargue la lista, los primeros elementos se van a mostrar, y los siguientes
                 * que esten fuera del viewport no se renderizaran todavia hasta que baje con la ruedita.
                 * Cuando baje con la ruedita y el ViewPort intersecte con el elemento señalado por el ref, se cambiara el estado
                 * de ese post y se mostrara
                */
                <>
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
                </>

            }
        </PostContainer >
    )
}

export default Post