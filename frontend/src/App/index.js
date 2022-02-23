import React, { useEffect } from 'react'

import Navbar from '../components/Navbar'
import { useAppContext } from '../context/appContext'
import { Outlet, useNavigate } from 'react-router-dom'

const App = () => {
    const { account } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!account) navigate("/login")

    }, [account, navigate])


    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default App