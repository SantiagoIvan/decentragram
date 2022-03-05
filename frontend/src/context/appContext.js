import React, { useState, useContext, useEffect } from 'react'
import { providers } from 'ethers'

import Decentragram from '../contracts/Decentragram'

const AppContext = React.createContext()


const AppContextProvider = ({ children }) => {
    const [provider, setProvider] = useState(null)
    const [contract, setContract] = useState(null)
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [chainId, setChainId] = useState(null)
    const [appDisabled, setAppDisabled] = useState(false)

    useEffect(() => {
        window.ethereum.on("chainChanged", () => window.location.reload())
        const getChainId = async () => {
            const _id = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(_id)
        }

        if (window.ethereum) {
            const _provider = new providers.Web3Provider(window.ethereum, 'any')
            setProvider(_provider)

            getChainId()
            if (!chainId) return
            if (["0x4", "0x2a"].includes(chainId)) {
                let _addr
                if (chainId === "0x4") { _addr = process.env.REACT_APP_RINKEBY_CONTRACT_ADDRESS }
                else { _addr = process.env.REACT_APP_KOVAN_CONTRACT_ADDRESS }
                const _contract = Decentragram({
                    provider: _provider,
                    address: _addr,
                })
                setContract(_contract)
            } else {
                alert("Select Kovan or Rinkeby network")
                setAppDisabled(true)
            }
        }
        return () => {
            document.removeEventListener("chainChanged", () => window.location.reload())
        }
    }, [chainId])

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
                appDisabled,
                setAppDisabled
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