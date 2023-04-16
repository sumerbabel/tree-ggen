import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { modalService } from '../modal/modal.service'

export function EditableComponent (): JSX.Element {
  const [childArrayComp, setDataEdit] = useState([{ id: uuidv4(), data: 'dato1' }])
  const onInputChange = (onInputEvent: any): void => {
    console.log('HTML', onInputEvent.target.innerHTML)
    console.log('TEXT', onInputEvent.target.innerText)
    console.log('split', onInputEvent.target.innerText.split(' '))
    const arraysplit = onInputEvent.target.innerText.split(' ')

    createcoMP(arraysplit)
  }

  function createcoMP (data: any[]): void {
    const datos = data.map(item => {
      return { id: uuidv4(), data: item }
    })

    console.log('datos', datos)
    setDataEdit(datos)
  }

  const [code, setCode] = useState(
    'function add(a, b) {\n  return a + b;\n}'
  )

  const handleChangeCode = (evn: any): void => {
    console.log('evn.target.value', evn.target.value)
    setCode(evn.target.value)
  }

  const handleCLikModal = (): void => {
    modalService.openModal(<EditableComponent />).subscribe((data) => {
      console.log('data modal close', data)
    })
  }

  const handleCLikClose = (): void => {
    modalService.closeModal({ close: true, data: code })
  }

  return (
    <div className='edit-comp1'>
      <CodeEditor
        value={code}
        language='js'
        placeholder='Please enter JS code.'
        onChange={handleChangeCode}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: '#f5f5f5',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
        }}
      />

      <div
        className='edit-comp' contentEditable='true' suppressContentEditableWarning
        onInput={onInputChange}
      >
        {childArrayComp.map(item => {
          return (<span className='span-comp' key={item.id}>{item.data}</span>)
        })}
      </div>
      <button onClick={handleCLikModal}>Modal</button>
      <button onClick={handleCLikClose}>CloseModal</button>
    </div>

  )
}
