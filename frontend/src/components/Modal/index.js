import React, { useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { SecondaryTitle } from '../Text'
import { Container, ModalContainer, Overlay, ModalHeader, CloseButton, ModalContent } from './ModalElements'
import { IconContext } from 'react-icons'

const Modal = ({
    header,
    showModal,
    variant,
    setModal,
    children }) => {

    const modalRef = useRef()

    const closeModalOnOutsideClick = e => {
        e.preventDefault()
        if (modalRef.current === e.target) {
            // clickeaste sobre el overlay, por lo tanto se cierra.
            // pero si clickeas dentro del modal container, 
            // como el target va a ser diferente, no se va a cerrar
            setModal(false)
        }
    }

    const closeModalOnEscapeKeyPress = useCallback((e) => {
        if (showModal && e.key === 'Escape') {
            setModal(false)
        }
    }, [showModal, setModal])

    useEffect(() => {
        document.addEventListener("keydown", closeModalOnEscapeKeyPress)

        return () => document.removeEventListener("keydown", closeModalOnEscapeKeyPress)
    }, [closeModalOnEscapeKeyPress])

    return ReactDOM.createPortal(
        <>
            <ModalContainer showModal={showModal}>
                <ModalHeader>
                    <SecondaryTitle>{header}</SecondaryTitle>
                    <IconContext.Provider value={{ style: { height: "32px", width: "32px" } }}>
                        <CloseButton onClick={() => setModal(false)} />
                    </IconContext.Provider>
                </ModalHeader>
                <ModalContent>
                    {children}
                </ModalContent>
            </ModalContainer>
            <Overlay showModal={showModal} ref={modalRef} onClick={e => closeModalOnOutsideClick(e)} />
        </>
        ,
        document.getElementById("portal")
    )
}
// ref={modalRef} onClick={e => closeModalOnOutsideClick(e)}
export default Modal