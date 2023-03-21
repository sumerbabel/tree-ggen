import { createContext, useContext, useState } from 'react';
import { TreeEvent } from './tree.data.interface';

export interface contextValue {
    setEventContext : (treeEvent:TreeEvent)=>void 
    getValueContext: ()=> TreeEvent
    confirmationEvent: (callback:any)=>void 
}

export const TreeContext = createContext<contextValue>({} as contextValue );

interface props {
	children:JSX.Element
}

export const TreeProvider = ({ children }:props) => {
  const [treeContextValue, setTreeContextValue] = useState<TreeEvent>({} as TreeEvent);

  const setEventContext =(treeEvent:TreeEvent)=>{
    setTreeContextValue(treeEvent)
  }

  const getValueContext =()=>{
    return treeContextValue
  }

  const confirmationEvent = (callback:any) => {
    console.log("Ejecutando funcion del contexto");
    callback();
  }


  return <TreeContext.Provider value={{setEventContext, getValueContext, confirmationEvent }}>{children}</TreeContext.Provider>;
};

export const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('TreeContext must be used within a TreeProvider');
  }
  return context;
};