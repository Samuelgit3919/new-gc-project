
import { createContext, useReducer } from "react"

// Create a context for the data provider
export const DataContext = createContext()

// Create a component that will wrap the children and provide the context
export const DataProvider = ({ children, reducer, initialState }) => {

    // Use the reducer to manage the state
    const [state, dispatch] = useReducer(reducer, initialState)

    // Return the context provider with the state and dispatch as its value
    return (
        <DataContext.Provider value={[state, dispatch]}>
            {children}
        </DataContext.Provider>
    )
}