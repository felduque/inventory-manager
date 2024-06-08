import React, { createContext } from "react";


const itemsFacture = createContext()
const setItemsFacture = createContext()


export const useItemsFacture = () => {
  return [itemsFacture, setItemsFacture]
}

export const ContextFacture = ({children}) => {
  const [ itemsFacture, setItemsFacture ] = useState([])
  return (
    <itemsFacture.Provider value={itemsFacture}>
      <setItemsFacture.Provider value={setItemsFacture}>
        {children}
      </setItemsFacture.Provider>
    </itemsFacture.Provider>
  )
}