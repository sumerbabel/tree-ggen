import React, { useEffect, useRef, useState } from 'react';
import './clipboard.css'
import { v4 as uuidv4 } from 'uuid';

interface NodeElementClip {
  id: string
  type: string
  data: any
  dataFile?:any
}
function ClipboardComponent() {

  const [nodeElmenteClip, setNodeElmenteClip] = useState<NodeElementClip[]>([{ id: uuidv4(), type: 'text', data: '...' }]);

  const ref = useRef(document.createElement("p"))

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    console.log('clipboardData',clipboardData.files.length)
    if (clipboardData) {
      const textClip = clipboardData.getData('Text')
      if (textClip) {
        nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: textClip })
        setNodeElmenteClip([...nodeElmenteClip])
      }

      if (!textClip) {
        const items = await clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item: any = items[i]
          console.log('item',item.name)
          const fileBlob = await item.getAsFile()
          console.log('blop name', fileBlob.name,fileBlob )
          if (item.type.indexOf('image') !== -1) {
            fileBlob && nodeElmenteClip.push({ id: uuidv4(), type: 'image', data: URL.createObjectURL(fileBlob),dataFile: fileBlob})
          } else {
            fileBlob && nodeElmenteClip.push({ id: uuidv4(), type: 'file', data: fileBlob.name,dataFile: fileBlob})
          }
        }
        nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: ' ' })
        setNodeElmenteClip([...nodeElmenteClip])
      }
    }

  }

  useEffect(() => {
    let range = document.createRange()
    let sel = window.getSelection()
    range.setStart(ref.current.childNodes[ref.current.children.length - 1], 1)
    range.collapse(true)

    sel?.removeAllRanges()
    sel?.addRange(range)
    console.log('nodeElmenteClip',nodeElmenteClip)
    return () => {

    }
  }, [nodeElmenteClip])

  return (
    <div className='su-clipboard' contentEditable={true} suppressContentEditableWarning={true} onPaste={handlePaste} ref={ref}>
      {nodeElmenteClip.map((item, index) => {
        return (
          <>
            {item.type === 'text' && <p id={item.id + index}>{item.data}</p>}
            {item.type === 'image' && <img id={item.id} src={item.data} />}
            {item.type === 'file' && <p id={item.id}>{item.data}</p>}
          </>
        )
      })}
    </div>
  )

};

export default ClipboardComponent