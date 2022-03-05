import React, { useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { utils } from 'ethers'
import { create } from 'ipfs-http-client'

import Navbar from '../components/Navbar'
import { PrimaryButton } from '../components/Button'
import { useAppContext } from '../context/appContext'
import { useModalContext } from '../context/modalContext'
import { Input, Label } from '../components/Modal/ModalElements'
import Modal from '../components/Modal'
import { Buffer } from 'buffer'
import { ModalImage } from '../components/Modal/ModalElements'
import { Title } from '../components/Text'

const ipfs = create(process.env.REACT_APP_IPFS_CREATE)

const App = () => {
    const { account, setLoading, provider, contract, appDisabled } = useAppContext()
    const { imageModalOpen, setImageModalOpen, tipModalOpen, setTipModalOpen, post, setSelectedFile, setNewPostModalOpen, newPostModalOpen, selectedFile } = useModalContext()
    const tipRef = useRef()
    const navigate = useNavigate()
    const descriptionRef = useRef()

    useEffect(() => {
        if (!account) navigate("/login")

    }, [account, navigate])

    const handleTipSubmit = async () => {
        try {
            setTipModalOpen(false)
            setLoading(true)
            const parsedNumber = utils.parseEther(tipRef.current.value)
            // Ether -> Wei. Es decir, recibe un string representando una cantidad en Ether, y retorna
            // un BigNumber representando la misma cantidad en Wei

            const signer = await provider.getSigner()

            const tx = await contract.populateTransaction.tipPost(post.id)
            const execTx = await signer.sendTransaction({ ...tx, "value": parsedNumber })
            await provider.waitForTransaction(execTx.hash)
        } catch (error) {
            alert("Transaction failed. Try again later")
            console.log("Error: ", { error })
        } finally {
            setLoading(false)
        }
    }

    const captureFile = (e) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = () => {
            setSelectedFile(Buffer(reader.result))
        }
    }

    const handleNewPostSubmit = async () => {
        try {
            setNewPostModalOpen(false)
            setLoading(true)
            const description = descriptionRef.current.value

            // Guardo la imagen en IPFS
            const result = await ipfs.add(selectedFile)

            // me guardo el path en la blockchain junto con la descripcion
            const signer = await provider.getSigner()
            const tx = await contract.populateTransaction.uploadPost(result.path, description)
            const execTx = await signer.sendTransaction({ ...tx })
            await provider.waitForTransaction(execTx.hash)
            alert("Done!")
        } catch (error) {
            console.log("Error: ", { error })
        } finally {
            setLoading(false)
        }
    }

    if (appDisabled) return (
        <>
            <Title>App disabled</Title>
        </>
    )
    return (
        <>
            <Modal header="Send some tips!" showModal={tipModalOpen} variant="tip" setModal={setTipModalOpen} >

                <Label htmlFor='amount'>Tips to send: </Label>
                <Input type="text" name="amount" id="amount" ref={tipRef} />
                <Input type="submit" onClick={handleTipSubmit} value="Send" />

            </Modal>


            <Modal
                header={"New Post"}
                showModal={newPostModalOpen}
                setModal={setNewPostModalOpen}
                variant="newPost"
            >
                <Label htmlFor='myFile'>Select a file</Label>
                <input type="file" id='myFile' name='myFile' required onChange={e => captureFile(e)} />
                <Label htmlFor="description">Description</Label>
                <Input type="text" name="description" id="description" ref={descriptionRef} required />
                <PrimaryButton onClick={handleNewPostSubmit}>Submit</PrimaryButton>
            </Modal>

            <Modal
                header={""}
                showModal={imageModalOpen}
                setModal={setImageModalOpen}
                variant="image"
            >
                {post && <ModalImage src={process.env.REACT_APP_IPFS_BASE_URL + post.path} />}
            </Modal>
            <Navbar />
            {/**TODO Lo puse aca porque en el Modal no me abre el buscador de archivos.
             * Intente creando un input type="button" que trigeree un click en un input file escondido 
             * para ver si asi me saltaba la ventaninta y tampoco
            */}
            <Label htmlFor='myFile'>Select a file</Label>
            <input type="file" id='myFile' name='myFile' required onChange={e => captureFile(e)} />
            <Label htmlFor="description">Description</Label>
            <Input type="text" name="description" id="description" ref={descriptionRef} required />
            <PrimaryButton onClick={handleNewPostSubmit}>Submit</PrimaryButton>

            <Outlet />
        </>
    )
}

export default App