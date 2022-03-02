import styled from "styled-components";

export const Container = styled.div`
    background: whitesmoke;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 100%;
`

export const Wrapper = styled.div`
    display:flex;
    justify-content: space-between;
    max-width: 1300px;
    flex-wrap: wrap;
    width: 100%;
    heigth: 100%;
    margin: auto;
`

export const LogoContainer = styled.div`
    margin-left: 4rem;
    display:flex;
    align-items: center;
    font-size: 1.2rem;
    font-family: sans-serif;
    cursor: pointer;
`

export const ConnectButtonContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0rem 1rem;
    justift-content: space-around;
`

export const MetamaskLogo = styled.img`
    heigth: 32px;
    width: 32px;
`