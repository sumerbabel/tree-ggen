import './App.css'
import Tree from './modules/tree/tree/tree'
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
    <Tree data={data} onChange={onChangeRecibedF} render={External} />
    <Tree data={data2} onChange={onChangeRecibedF2} />
    </>
  )
}

export default App

export const External = (props: any) => {return (<div className="ux-external"> external {props.label + "HIJO DE P2"}</div>)}
