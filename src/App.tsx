
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
function App() {
  const data = DATA
  const data2 = {...DATA}
  const onChangeRecibedF = (retorno: any) => {
    retorno.observer.setSubject(retorno.node)
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL data', data)
  }

  const onChangeRecibedF2 = (retorno: any) => {
    retorno.observer.setSubject(retorno.node)
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL2', retorno)
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL data2', data2)
  }


  return (
    <>
    <Tree data={data} onChange={onChangeRecibedF} render={External} />
    <Tree data={data2} onChange={onChangeRecibedF2} />

    </>
      
  )
}
export default App

export const External = (props: any) => {
	return (
		<div className="ux-external"> external {props.label + "HIJO DE P2"}</div>
	);
};
