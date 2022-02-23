import React from 'react'

import { Main } from '../../components/Main'
import { Title } from '../../components/Text'

const Login = () => {
    return (
        <Main>
            <Title>Please connect your wallet!</Title>
            <img src="metamask.png" alt="metamask-logo" style={{ marginTop: "2rem", width: "300px", heigth: "300px" }} />
        </Main>
    )
}

export default Login