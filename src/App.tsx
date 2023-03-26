
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'

function App() {
  const data = DATA
  const data2 = structuredClone(DATA)

  const onChangeRecibedF = (treeEventData: TreeDataEvent<string>, subject: TreeSubject<TreeDataEvent<string>>) => {
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  const onChangeRecibedF2 = (treeEventData: TreeDataEvent<string>, subject: TreeSubject<TreeDataEvent<string>>) => {
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  return (
    <>
      <Tree <string> data={data} onChange={onChangeRecibedF} render={External} />
      <Tree <string> data={data2} onChange={onChangeRecibedF2} />
    </>
  )
}

export default App

export function External<T>(props: RenderTree<T>) {

  const toggleExpand = () => {
    const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.toggleExpand, TreeKeyEvent.ConfirmationUpdate, props.data)
    const ejecuteexpand = props.onChange(treeDataEvent)
    console.log('ejecuteexpand', ejecuteexpand)
  }

  const createNode = () => {
    const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationUpdate, props.data)
    const ejecuteCreateNode = props.onChange(treeDataEvent)
    console.log('ejecuteCreateNode', ejecuteCreateNode)
  }

  const deleteNode = () => {
    const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationUpdate, props.data)
    const ejecuteDeleteNode = props.onChange(treeDataEvent)
    console.log('ejecuteDeleteNode', ejecuteDeleteNode)
  }

  return (<div className="ux-external"> external {props.data.label}
    <button onClick={toggleExpand} >expandir</button>
    <button onClick={createNode} >agregar</button>
    <button onClick={deleteNode} >Eliminar</button>
  </div>)
}

