
import { useState } from 'react'
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'

function App() {
  const data: any = DATA
  const data2: any = structuredClone(DATA)
  const data3: any = structuredClone(DATA)

  const [datatree, setDataTree] = useState<TreeDataModel<string>>(data2)

  const onChangeRecibedF = (treeEventData: TreeDataEvent<string>, subject: TreeSubject<TreeDataEvent<string>>) => {
    console.log('treeEventData on change',treeEventData )
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  const onChangeRecibedF2 = (treeEventData: TreeDataEvent, subject: TreeSubject<TreeDataEvent>) => {
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  const arrayKeysEvents = [TreeKeyEvent.Create, TreeKeyEvent.Update, TreeKeyEvent.Delete]

  const viewdatamodel = () => {
    console.log('data2', datatree)
  }

  return (
    <>
      <Tree <string> data={datatree} onChange={onChangeRecibedF} render={External} subsititute_row_contend={true} arrayKeysEvents={arrayKeysEvents} />
      <Tree data={data} onChange={onChangeRecibedF2} arrayKeysEvents={arrayKeysEvents} />
      <Tree data={data3} />
      <button onClick={viewdatamodel} >agregar</button>
    </>
  )
}

export default App

export function External(props: RenderTree<string>) {

  const [data, setMessage] = useState<TreeDataModel<string>>(props.data);

  const generalChange=()=>{
    setMessage({ ...data });
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Update, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const handleChange = (inputEvent:any) => {
    props.data['data'] = inputEvent.target.value
    data.label = inputEvent.target.value
    generalChange()
  }

  const handleChangeId = (inputEvent:any) => {
    console.log(inputEvent.target.value)
    props.data.data = inputEvent.target.value
    data.data = inputEvent.target.value
    generalChange()
  }

  const toggleExpand = () => {
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.toggleExpand, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const createNode = () => {
     props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const deleteNode = () => {
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  return (
    <>
     <div className="ux-external"> external {data.label}
      <button onClick={toggleExpand} >expandir</button>
      <button onClick={createNode} >agregar</button>
      <button onClick={deleteNode} >Eliminar</button>
      <input type="text"
        id="messagex"
        name="messagex"
        value={data.data}
        onChange={handleChangeId} />

      <input type="text"
        id="message"
        name="message"
        value={data.label}
        onChange={handleChange} />
   
    </div>
    <div className="ux-external"> external2 {data.label}
      <button onClick={toggleExpand} >expandir2</button>
      <button onClick={createNode} >agregar2</button>
      <button onClick={deleteNode} >Eliminar2</button>
      <input type="text"
        id="messagex"
        name="messagex"
        value={data.data}
        onChange={handleChangeId} />

      <input type="text"
        id="message"
        name="message"
        value={data.label}
        onChange={handleChange} />
   
    </div>
    </>
   )
}

