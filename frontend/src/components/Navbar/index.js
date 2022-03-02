import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Blockies from 'react-blockies'

import { Container, LogoContainer, Wrapper, ConnectButtonContainer, MetamaskLogo } from './NavbarElements'
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

    useEffect(() => {
        const listener = () => {
            const el = document.getElementById("my-nav")
            if (window.scrollY > 70) {//ese 70 lo saque con el inspector element.
                if (!el.classList.contains("fixed-nav")) el.classList.add("fixed-nav")
            } else {
                if (el.classList.contains("fixed-nav")) el.classList.remove("fixed-nav")
            }
        }

        window.addEventListener("scroll", listener)
        return () => {
            window.removeEventListener("scroll", listener)
        }
    }, [])

    return (
        <Container id="my-nav">
            <Wrapper>
                <IconContext.Provider value={{ style: { fontSize: "2rem", color: "#e1306c" } }}>
                    <LogoContainer onClick={handleLogoClick}>
                        <FiInstagram />
                    </LogoContainer>
                </IconContext.Provider>
                <ConnectButtonContainer>
                    {account ? <Link to={`/users/${account}`} ><Blockies seed={account} /></Link> : <MetamaskLogo src="metamask.svg" />}
                    <ConnectButton onClick={handleConnectButton}>
                        {!account ? "Connect Wallet" : `Log out: ${account.slice(0, 10)}...`}
                    </ConnectButton>
                </ConnectButtonContainer>
            </Wrapper>
        </Container>
    )
}

export default Navbar