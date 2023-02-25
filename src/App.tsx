
import './App.css'
import Tree from './modules/tree/tree/tree'
import { treeService } from './modules/tree/tree/tree-service'
import { DATA } from './modules/tree/tree/tree.data'

function App() {
const dataProp = DATA
  console.log('entro app')
  const subscription$ = treeService.getSubject();
  subscription$.subscribe((data:any)=>{
    if(data['action'] =='add'){
      console.log('data original', dataProp)
      setTimeout(() => {
        treeService.setSubject({action:'add-ok', data :data['data']});
      }, 300)
    }
  })

	const onChangeRecibedF=(retorno:any)=>{
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
      }
  return (
    <Tree data={dataProp} contador={0}   onChange={onChangeRecibedF} />
  )
}

export default App
