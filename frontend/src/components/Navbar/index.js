import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Container, LogoContainer, Wrapper } from './NavbarElements'
import { FiInstagram } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { ConnectButton } from '../Button'
import { useAppContext } from '../../context/appContext'

const Navbar = () => {
    const navigate = useNavigate()
    const { account, setAccount } = useAppContext()

    const handleLogoClick = () => {
        navigate("/")
    }

    const handleConnectButton = async () => {
        if (!account) {
            if (window.ethereum) {
                const [_firstAccount] = await window.ethereum.request({
                    method: "eth_requestAccounts"
                })
                setAccount(_firstAccount)
                navigate("/")
            }
        } else {//Si ya esta conectado y hacemos click en el boton, nos desconectamos
            setAccount(null)
        }
    }

    return (
        <Container>
            <Wrapper>
                <IconContext.Provider value={{ style: { fontSize: "2rem", color: "#e1306c" } }}>
                    <LogoContainer onClick={handleLogoClick}>
                        <FiInstagram />
                    </LogoContainer>
                </IconContext.Provider>
                <ConnectButton onClick={handleConnectButton}>
                    {!account ? "Connect Wallet" : `Log out from ${account.slice(0, 10)}...`}
                </ConnectButton>

            </Wrapper>
        </Container>
    )
}

export default Navbar