import React, { useState, useContext, useEffect } from 'react'
import { providers } from 'ethers'

import Decentragram from '../contracts/Decentragram'

const AppContext = React.createContext()


const AppContextProvider = ({ children }) => {
    const [provider, setProvider] = useState(null)
    const [contract, setContract] = useState(null)
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [tipRequested, setTipRequested] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (window.ethereum) {
            const _provider = new providers.Web3Provider(window.ethereum, 'any')
            const _contract = Decentragram({
                provider: _provider,
                address: process.env.REACT_APP_CONTRACT_ADDRESS
            })
            setProvider(_provider)
            setContract(_contract)
        }
    }, [])

    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                account,
                setAccount,
                provider,
                setProvider,
                contract,
                setContract,
                tipRequested,
                setTipRequested,
                isModalOpen,
                setIsModalOpen
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppContextProvider }