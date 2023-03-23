import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
import { TreeData } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'

function App() {
  const data = DATA
  const data2 = structuredClone(DATA)

  const onChangeRecibedF = (treeEventData: TreeData<string>, subject:TreeSubject<TreeData<string>>) => {
    treeEventData.event =treeEventData.eventConfirmation
    setTimeout(() => {subject.next(treeEventData)}, 0)
    console.log('RETORNO1', treeEventData)
  }

  const onChangeRecibedF2 = (treeEventData: TreeData<string>, subject:TreeSubject<TreeData<string>>) => {
    treeEventData.event =treeEventData.eventConfirmation
    setTimeout(() => {subject.next(treeEventData)}, 0)
    console.log('RETORNO2', treeEventData)
  }

  return (
    <>
    <Tree <string> data={data} onChange={onChangeRecibedF} render={External} />
    <Tree <string> data={data2} onChange={onChangeRecibedF2} />
    </>
  )
}

export default App

export const External = (props: any) => {return (<div className="ux-external"> external {props.label + "HIJO DE P2"}</div>)}
