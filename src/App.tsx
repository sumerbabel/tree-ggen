
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
import { RenderTree, TreeDataEvent, TreeKeyEvent } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'

function App() {
  const data:any = DATA
  const data2:any = structuredClone(DATA)

  const onChangeRecibedF = (treeEventData: TreeDataEvent, subject: TreeSubject<TreeDataEvent>) => {
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  const onChangeRecibedF2 = (treeEventData: TreeDataEvent, subject: TreeSubject<TreeDataEvent>) => {
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  const arrayKeysEvents =[TreeKeyEvent.Create, TreeKeyEvent.Update, TreeKeyEvent.Delete]

  return (
    <>
      <Tree  data={data2} onChange={onChangeRecibedF} render={External} complete_subsititute_row_contend={true} arrayKeysEvents ={arrayKeysEvents} />
      <Tree  data={data} onChange={onChangeRecibedF2} arrayKeysEvents ={arrayKeysEvents}/>
    </>
  )
}

export default App

export function External<T = unknown>(props: RenderTree<T>) {
  const toggleExpand = () => {
    const ejecuteexpand = props.onChange(new TreeDataEvent<T>(TreeKeyEvent.toggleExpand, TreeKeyEvent.ConfirmationUpdate, props.data))
    console.log('ejecuteexpand', ejecuteexpand)
  }

  const createNode = () => {
    const ejecuteCreateNode = props.onChange(new TreeDataEvent<T>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationUpdate, props.data))
    console.log('ejecuteCreateNode', ejecuteCreateNode)
  }

  const deleteNode = () => {
    const ejecuteDeleteNode = props.onChange(new TreeDataEvent<T>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationUpdate, props.data))
    console.log('ejecuteDeleteNode', ejecuteDeleteNode)
  }

  return (<div className="ux-external"> external {props.data.label}
    <button onClick={toggleExpand} >expandir</button>
    <button onClick={createNode} >agregar</button>
    <button onClick={deleteNode} >Eliminar</button>
  </div>)
}

