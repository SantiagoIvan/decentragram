import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons'
import ReactPaginate from 'react-paginate';

import { Main } from '../../components/Main'
import { Title } from '../../components/Text'
import PostList from '../../components/PostList'
import Loading from '../../components/Loading'
import { NewPostButton, PrimaryButton } from '../../components/Button'

import Modal from '../../components/Modal'
import { Input, Label } from '../../components/Modal/ModalElements'
import { useAppContext } from '../../context/appContext'

import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer';

const ipfs = create(process.env.REACT_APP_IPFS_CREATE)

const Home = () => {
    const { loading, setLoading, contract, provider } = useAppContext()
    const [newPostModalOpen, setNewPostModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const descriptionRef = useRef()

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
            const _postCount = await contract.postCount()
            setPageCount(Math.ceil(_postCount / limit))
            const _posts = await contract.getPosts(currentPage, limit)
            setPosts(_posts)
        } catch (error) {
            console.log("Error fetching data", { error })
        }
    }, [contract, currentPage])

    useEffect(() => {
        if (!contract) return
        setLoading(true)
        console.log("acaaa")
        loadDataFromBlockchain()
        setLoading(false)
    }, [setLoading, contract, currentPage, loadDataFromBlockchain])


    //NewPost
    const handleNewPostButton = () => {
        setNewPostModalOpen(true)
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

    if (loading) {
        return <Main><Loading /></Main>
    }
    if (!loading && !posts) {
        return <Main><Title>We have no posts yet :(</Title></Main>
    }
    return (
        <Main>
            <form>
                <Label htmlFor='myFile'>Select a file</Label>
                <input type="file" id='myFile' name='myFile' required onChange={e => captureFile(e)} />
                <Label htmlFor="description">Description</Label>
                <Input type="text" name="description" id="description" ref={descriptionRef} required />
                <PrimaryButton onClick={handleNewPostSubmit}>Submit</PrimaryButton>
            </form>
            {/**TODO Lo puse aca porque en el Modal no me abre el buscador de archivos.
             * Intente creando un input de boton que trigeree un click en un input file escondido 
             * para ver si asi me saltaba la ventaninta y tampoco
            */}
            <Modal
                header={"New Post"}
                showModal={newPostModalOpen}
                setModal={setNewPostModalOpen}
                variant="newPost"
            >
            </Modal>

            <Title>Decentragram</Title>
            <IconContext.Provider value={{ style: { height: "3rem", width: "3rem" } }}>
                <NewPostButton onClick={handleNewPostButton} />
            </IconContext.Provider>
            <PostList posts={posts} />
            <ReactPaginate
                previousLabel="<<"
                nextLabel=">>"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName='pagination justify-content: center' //https://getbootstrap.com/docs/5.1/components/pagination/
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                previousLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                activeClassName='active'
            />
        </Main>
    )
}

export default Home