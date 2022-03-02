import React, { useState, useContext } from 'react'

const ModalContext = React.createContext()


const ModalContextProvider = ({ children }) => {
    const [newPostModalOpen, setNewPostModalOpen] = useState(false)
    const [tipModalOpen, setTipModalOpen] = useState(false)
    const [post, setPost] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <ModalContext.Provider
            value={{
                newPostModalOpen,
                setNewPostModalOpen,
                tipModalOpen,
                setTipModalOpen,
                post,
                setPost,
                selectedFile,
                setSelectedFile
            }}
        >
            {children}
        </ModalContext.Provider>
    )
}

export const useModalContext = () => {
    return useContext(ModalContext)
}

export { ModalContext, ModalContextProvider }