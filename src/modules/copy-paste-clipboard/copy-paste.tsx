import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import './clipboard.css'
import { v4 as uuidv4 } from 'uuid';

interface NodeElementClip {
  id: string
  type: string
  data: any
}
function ClipboardComponent() {

  // const [text, setText] = useState('Pegue aqui');
  // const [image, setImage] = useState('');
  const [nodeElmenteClip, setNodeElmenteClip] = useState<NodeElementClip[]>([{ id: uuidv4(), type: 'text', data: '...' }]);

  const ref = useRef(document.createElement("p"))

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData) {

      const textClip = clipboardData.getData('Text')

      if (textClip) {

        nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: textClip })
        setNodeElmenteClip([...nodeElmenteClip])
        //setText(textClip);

      }

      if (!textClip) {
        const items = await clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item: any = items[i]
          if (item.type.indexOf('image') !== -1) {
            const blob = await item.getAsFile();
            blob && nodeElmenteClip.push({ id: uuidv4(), type: 'image', data: URL.createObjectURL(blob) })
            nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: ' ' })
            nodeElmenteClip.push({ id: uuidv4(), type: 'text', data: ' ' })
            setNodeElmenteClip([...nodeElmenteClip]) //setImage(URL.createObjectURL(blob));
          }
        }
      }
    }

    //ref.current.focus()
    //console.log( 'ref.current',  ref.current.children.length,ref)
   
   
  //  let range = document.createRange()
  //  let sel = window.getSelection()
  //  console.log('current',ref.current.childNodes[ref.current.children.length-1])
   
  //  range.setStart(ref.current.childNodes[ref.current.children.length-1], 1)
  //  range.collapse(true)
   
  //  sel?.removeAllRanges()
  //  sel?.addRange(range)
  
  
  }

  useEffect(() => {
   let range = document.createRange()
   let sel = window.getSelection()
   range.setStart(ref.current.childNodes[ref.current.children.length-1], 1)
   range.collapse(true)
   
   sel?.removeAllRanges()
   sel?.addRange(range)
    return () => {
      
    }
  }, [nodeElmenteClip])
  
  return (
    <div className='su-clipboard' contentEditable={true} suppressContentEditableWarning={true}  onPaste={handlePaste} ref={ref}>
      {nodeElmenteClip.map((item, index) => {
        return (
         <>
            {item.type === 'text' &&<p id={item.id +index}>{item.data}</p>}
            {item.type === 'image' && <img id={item.id} src={item.data}/>}
         </>
        )
      })}
    </div>
  )

};

export default ClipboardComponent