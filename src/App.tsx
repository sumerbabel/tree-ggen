
import { useState } from 'react'
import './App.css'
import { DATA } from './modules/tree/tree/tree.data'
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from './modules/tree/tree/tree.data.interface'
import { TreeSubject } from './modules/tree/tree/tree.subject'
import ClipboardComponent, { PropsNodeElementClip } from './modules/copy-paste-clipboard/copy-paste'
import { v4 as uuidv4 } from 'uuid'
import Tree from './modules/tree/tree/tree'
import { Route, Routes } from 'react-router-dom'
import ModalConteiner from './modules/modal/modal-conteiner'
import SpinnerConteiner from './modules/spinner/spinner-conteiner'
import Login from './modules/demo-axios/demo-login'
import ToastsConteiner from './modules/shared/components/toasts/toasts-conteiner'

function App (): JSX.Element {
  const data2: any = structuredClone(DATA)

  const [datatree] = useState<TreeDataModel<string>>(data2)

  const onChangeRecibedF = (treeEventData: TreeDataEvent<string>, subject: TreeSubject<TreeDataEvent<string>>): void => {
    console.log('treeEventData on change', treeEventData)
    subject.next(treeEventData.getTreDataEventConfirmation())
  }

  // const onChangeRecibedF2 = (treeEventData: TreeDataEvent, subject: TreeSubject<TreeDataEvent>): void => {
  //   subject.next(treeEventData.getTreDataEventConfirmation())
  // }

  const arrayKeysEvents = [TreeKeyEvent.Create, TreeKeyEvent.Update, TreeKeyEvent.Delete]

  const dataClip: PropsNodeElementClip[] = [{ id: uuidv4(), type: 'text', data: 'TEXTO CARGADO' }, { id: uuidv4(), type: 'text', data: 'TEXTO CARGADO 2' }]

  return (
    <>
      <ToastsConteiner />
      <SpinnerConteiner />
      <ModalConteiner />
      <Routes>
        <Route path='/' element={<Tree <string> data={datatree} onChange={onChangeRecibedF} render={External} subsitituteRowContend arrayKeysEvents={arrayKeysEvents} />} />
        <Route path='/clip/:paramRoute' element={<ClipboardComponent dataClipboard={dataClip} />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App

export function External (props: RenderTree<string>): JSX.Element {
  const [data, setMessage] = useState<TreeDataModel<string>>(props.data)

  const generalChange = (): void => {
    setMessage({ ...data })
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Update, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const handleChange = (inputEvent: any): void => {
    props.data.data = inputEvent.target.value
    data.label = inputEvent.target.value
    generalChange()
  }

  const handleChangeId = (inputEvent: any): void => {
    console.log(inputEvent.target.value)
    props.data.data = inputEvent.target.value
    data.data = inputEvent.target.value
    generalChange()
  }

  const toggleExpand = (): void => {
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.toggleExpand, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const createNode = (): void => {
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  const deleteNode = (): void => {
    props.onChange(new TreeDataEvent<string>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationUpdate, props.data))
  }

  // -------
  const [text, setText] = useState('')
  let valor = ''
  const handleChange2 = (event: any): void => {
    console.log(event)
    valor = event.target.innerText
    setText(valor)
    valor = ''
  }

  return (
    <>
      <div className='ux-external'> external {data.label}
        <button onClick={toggleExpand}>expandir</button>
        <button onClick={createNode}>agregar</button>
        <button onClick={deleteNode}>Eliminar</button>
        <input
          type='text'
          id='messagex'
          name='messagex'
          value={data.data}
          onChange={handleChangeId}
        />

        <input
          type='text'
          id='message'
          name='message'
          value={data.label}
          onChange={handleChange}
        />

      </div>

      <div className='div-edit1' onInput={handleChange2}>
        <span>{text}</span>
        <div
          className='div-edit'
          contentEditable='true'
          onInput={handleChange2}
        />
      </div>

    </>
  )
}
