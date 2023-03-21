import './App.css'
import Tree from './modules/tree/tree/tree'
import { TreeProvider } from './modules/tree/tree/tree.context'
import { DATA } from './modules/tree/tree/tree.data'
import { TreeEventData } from './modules/tree/tree/tree.data.interface'

function App() {
  const data = DATA
  const data2 = structuredClone(DATA)

  const onChangeRecibedF = (treeEventData: TreeEventData<any>) => {
    setTimeout(() => {treeEventData.subject.next({ event: treeEventData.treeData.eventConfirmation, data: treeEventData.treeData })}, 0)
    console.log('RETORNO1', treeEventData)
  }

  const onChangeRecibedF2 = (treeEventData: TreeEventData<any>) => {
    setTimeout(() => {treeEventData.subject.next({ event: treeEventData.treeData.eventConfirmation, data: treeEventData.treeData })}, 0)
    console.log('RETORNO2', treeEventData)
  }

  return (
    <>
    <TreeProvider>
    <Tree data={data} onChange={onChangeRecibedF} render={External} />
    </TreeProvider>

    <TreeProvider>
    <Tree data={data2} onChange={onChangeRecibedF2} />
    </TreeProvider>
   
      
    </>
  )
}

export default App

export const External = (props: any) => {return (<div className="ux-external"> external {props.label + "HIJO DE P2"}</div>)}
