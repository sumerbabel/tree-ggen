
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
function App() {
  const data = DATA
  const onChangeRecibedF = (retorno: any) => {
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL data', data)
  }
  return (
      <Tree data={data} onChange={onChangeRecibedF} />
  )
}
export default App
