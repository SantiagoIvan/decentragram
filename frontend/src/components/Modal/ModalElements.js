import styled from 'styled-components'
import { GrFormClose } from 'react-icons/gr'


export const Overlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index:2;
    background: rgb(0,0,0,.5);
    
    display: ${({ showModal }) => showModal ? "flex" : "none"};
    align-items: center;
    justify-content: center;
`

export const ModalContainer = styled.div`
    position: relative;
    width: 80%;
    max-width:600px;
    height: auto;
    max-height: 600px;
    border-radius: 5px;
    z-index:3;
    background: whitesmoke;
    padding: 20px;
`

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .5rem;
`

export const CloseButton = styled(GrFormClose)`
    background: whitesmoke;
    transition: 0.5s all ease;
    &:hover{
        cursor: pointer;
        background: rgb(0,0,0,.5);
        transition: 0.5s all ease;
    }
`
export const ModalContent = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

export const Label = styled.label`
    margin: 0.5rem;
    font-weight: bolder;
    font-size: 1.5rem;
    font-family: 'Redressed', cursive
`

export const Input = styled.input`
    margin: .5rem;
`

export const ModalImage = styled.img`
    width: 100%;
    heigth: 100%;
`