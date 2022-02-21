import React, { useState, useContext } from 'react'
const AppContext = React.createContext()


const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)


    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                account,
                setAccount
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }