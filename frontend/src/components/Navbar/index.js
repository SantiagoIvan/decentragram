import React from 'react'
import { Container, LogoContainer, Menu, MenuItem, MenuItemLink, Wrapper } from './NavbarElements'
import { FiInstagram } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { ConnectButton } from '../Button'

const Navbar = () => {
    return (
        <Container>
            <Wrapper>
                <IconContext.Provider value={{ style: { fontSize: "2rem", color: "#e0792a" } }}>
                    <LogoContainer>
                        <FiInstagram />
                    </LogoContainer>
                </IconContext.Provider>
                <ConnectButton>
                    Connect Wallet
                </ConnectButton>

            </Wrapper>
        </Container>
    )
}

export default Navbar