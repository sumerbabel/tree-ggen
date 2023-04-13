
import { useState } from 'react'
import './App.css'
import { DATA } from './modules/tree/tree/tree.data'
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'
import ClipboardComponent, { PropsNodeElementClip } from './modules/copy-paste-clipboard/copy-paste'
import { v4 as uuidv4 } from 'uuid';
import Spinner from './modules/spinner/spinner'
import { spinnerService } from './modules/spinner/sppimer.service'


function App() {
  const data: any = DATA
  const data2: any = structuredClone(DATA)
  const data3: any = structuredClone(DATA)

  const [isOpenSpinner, setIsOpenSpinner] =useState<boolean>(false)

  spinnerService.getSpinnerSubject().subscribe((isOpen)=>{
    console.log('llega al spinner service', isOpen)
    setIsOpenSpinner(isOpen)
  })

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

  const dataClip:PropsNodeElementClip[] =[{id: uuidv4(), type: 'text', data: 'TEXTO CARGADO'},{id: uuidv4(), type: 'text', data: 'TEXTO CARGADO 2'}] 

  return (
    <>
   {isOpenSpinner && <Spinner></Spinner>} 
      {/* <Tree <string> data={datatree} onChange={onChangeRecibedF} render={External} subsititute_row_contend={true} arrayKeysEvents={arrayKeysEvents} />
      <EditableComponent></EditableComponent> */}
      <ClipboardComponent dataClipboard={dataClip}></ClipboardComponent>
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

  //-------
  const [text, setText] = useState("");
 let valor =''
  const handleChange2=(event:any)=> {
    console.log(event)
    valor = event.target.innerText
    setText(valor);
    valor=''
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

    <div className='div-edit1'  onInput={handleChange2}>
        {<span>{text}</span>}
    <div className='div-edit'
      contentEditable="true"
      onInput={handleChange2}
    ></div>
    </div>





    </>
   )
}

