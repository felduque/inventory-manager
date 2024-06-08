import React, { createContext } from "react";


const inCardItem = createContext()
const setInCardItem = createContext()


export const useTotalItems = () => {
  return [inCardItem, setInCardItem]
}

export const ContextSell = ({children}) => {
  const [ inCardItem, setInCardItem ] = useState([])
  return (
    <inCardItem.Provider value={inCardItem}>
      <setInCardItem.Provider value={setInCardItem}>
        {children}
      </setInCardItem.Provider>
    </inCardItem.Provider>
  )
}