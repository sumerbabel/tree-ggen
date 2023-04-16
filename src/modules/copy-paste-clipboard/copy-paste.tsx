import React, { useEffect, useRef, useState } from 'react'
import './clipboard.css'
import { v4 as uuidv4 } from 'uuid'
import { spinnerService } from '../spinner/sppimer.service'
import { modalService } from '../modal/modal.service'
import { EditableComponent } from '../edit-component/edit-component'

export interface PropsNodeElementClip {
  id: string
  type: string
  data: any
  dataFile?: any
}

export interface propsClipboard {
  dataClipboard: PropsNodeElementClip[]
  onChange?: () => void
}

function ClipboardComponent ({ dataClipboard = [], onChange }: propsClipboard): JSX.Element {
  const [nodeElmenteClip, setNodeElmenteClip] = useState<PropsNodeElementClip[]>(dataClipboard)

  const [componentList, setComponentList] = useState<any[]>(() => {
    const initialComponentList: any[] = []
    dataClipboard.forEach(item => {
      switch (item.type) {
        case 'image':
          initialComponentList.push(ImgeComponent(item.id, item.data))
          break
        case 'text':
          initialComponentList.push(TextComponent(item.id, item.data))
          break
        case 'file':
          initialComponentList.push(FileComponent(item.id, item.data))
          break
      }
    })

    return initialComponentList
  })

  const referenceDivEditable = useRef(document.createElement('div'))

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>): void => {
    spinnerService.openSpinner()
    event.preventDefault()
    const clipboardData = event.clipboardData
    if (clipboardData !== undefined) {
      const textClip = clipboardData.getData('Text').trim()
      if (textClip !== '') {
        const arrayTextClip = textClip.split(/\r?\n/)
        arrayTextClip.forEach(text => {
          const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'text', data: text }
          nodeElmenteClip.push(nodeClip)
          componentList.push(TextComponent(nodeClip.id, nodeClip.data))
        })

        setNodeElmenteClip([...nodeElmenteClip])
        setComponentList([...componentList])
      }

      if (textClip === '') {
        const items = clipboardData.items
        for (let i = 0; i < items.length; i++) {
          const item: any = items[i]
          const fileBlob = item.getAsFile()
          if (item.type.indexOf('image') !== -1) {
            const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'image', data: URL.createObjectURL(fileBlob), dataFile: fileBlob }
            nodeElmenteClip.push(nodeClip)
            componentList.push(ImgeComponent(nodeClip.id, nodeClip.data))
          } else {
            const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'file', data: fileBlob.name, dataFile: fileBlob }
            nodeElmenteClip.push(nodeClip)
            componentList.push(FileComponent(nodeClip.id, nodeClip.data))
          }
        }

        const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'text', data: ' ' }
        nodeElmenteClip.push(nodeClip)
        componentList.push(TextComponent(nodeClip.id, nodeClip.data))
        setComponentList([...componentList])
        setNodeElmenteClip([...nodeElmenteClip])
      }
    }

    setTimeout(() => {
      spinnerService.closeSpinner()
    }, 1000 * 5)
  }

  useEffect(() => {
    const ultimoNodo: any = referenceDivEditable.current.childNodes[referenceDivEditable.current.children.length - 1]
    if (ultimoNodo !== undefined) {
      const range = document.createRange()
      const sel = window.getSelection()
      let startNode = 2
      const longitudUltimoNodo: any = ultimoNodo?.childNodes[1]
      if (longitudUltimoNodo === undefined) {
        startNode = 1
      }
      range.setStart(ultimoNodo, startNode)
      range.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    return () => {

    }
  }, [componentList])

  // drag and drop section :
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    console.log('1 handleDragEnter entra area', e)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    console.log('3 handleDragLeave sale area', e)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    // console.log('2 handleDragOver se mantiene en el area',e);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      const fileBlob: any = files[i]

      if (fileBlob.type.indexOf('image') !== -1) {
        const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'image', data: URL.createObjectURL(fileBlob), dataFile: fileBlob }
        nodeElmenteClip.push(nodeClip)
        componentList.push(ImgeComponent(nodeClip.id, nodeClip.data))
      } else {
        const nodeClip: PropsNodeElementClip = { id: uuidv4(), type: 'file', data: fileBlob.name, dataFile: fileBlob }
        nodeElmenteClip.push(nodeClip)
        componentList.push(FileComponent(uuidv4(), fileBlob.name))
      }
    }
    nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: ' ' })
    componentList.push(TextComponent(uuidv4(), ' '))
    setComponentList([...componentList])
    setNodeElmenteClip([...nodeElmenteClip])
  }

  function TextComponent (id: string, data: string): JSX.Element {
    return (<div key={id}> {data}</div>)
  }

  function ImgeComponent (id: string, data: string): JSX.Element {
    return (<img key={id} src={data} />)
  }

  function FileComponent (id: string, data: string): JSX.Element {
    return (<p key={id}> {data}</p>)
  }

  const handleCLikModal = (): void => {
    modalService.openModal(<EditableComponent />).subscribe((data) => {
      console.log('data comp inicial', data)
    })
  }

  return (
    <>
      <div
        className='su-clipboard'
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        ref={referenceDivEditable}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {componentList.map(item => item)}
      </div>

      <button onClick={handleCLikModal}>Modal</button>
    </>
  )
}

export default ClipboardComponent
