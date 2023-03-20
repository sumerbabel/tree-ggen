import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA, DATA2 } from './modules/tree/tree/tree.data'
import { TreeEvent } from './modules/tree/tree/tree.data.interface'
function App() {
  const data = DATA
  const data2 =structuredClone(DATA)

  if (data === data2) {console.log('SON IDENTICOS')}

  const onChangeRecibedF = (retorno: any) => {
    if(retorno.dataEvent.event ===TreeEvent.Create){
      retorno.observer.setSubject({event:TreeEvent.ConfirmationCreate,data:retorno.dataEvent.data})
    }

    if(retorno.dataEvent.event ===TreeEvent.Delete){
      retorno.observer.setSubject({event:TreeEvent.ConfirmationDelete,data:retorno.dataEvent.data})
    }
  
    console.log('RETORNO1', retorno)
  }

  const onChangeRecibedF2 = (retorno: any) => {
    if(retorno.dataEvent.event ===TreeEvent.Create){
      retorno.observer.setSubject({event:TreeEvent.ConfirmationCreate,data:retorno.dataEvent.data})
    }

    if(retorno.dataEvent.event ===TreeEvent.Delete){
      retorno.observer.setSubject({event:TreeEvent.ConfirmationDelete,data:retorno.dataEvent.data})
    }

    console.log('RETORNO2', retorno)
  }


  return (
    <>
    <Tree data={data} onChange={onChangeRecibedF} render={External}/>
    <Tree data={data2} onChange={onChangeRecibedF2}/>
    </>
      
  )
}
export default App

export const External = (props: any) => {
	return (
		<div className="ux-external"> external {props.label + "HIJO DE P2"}</div>
	);
};
