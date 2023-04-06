import React, { SyntheticEvent, useState } from 'react';
import './clipboard.css'
import { v4 as uuidv4 } from 'uuid';

interface NodeElementClip{
    key:string
    type:string
    data:any
}
function ClipboardComponent(){

    const [text, setText] = useState('Pegue aqui');
    const [image, setImage] = useState('');
    const[nodeElmenteClip, setNodeElmenteClip] =useState<NodeElementClip[]>([{key:'1',type:text,data:'...'}]);
  
const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    
    if(clipboardData){

    const textClip =clipboardData.getData('Text')

    if (textClip) {
          
        nodeElmenteClip.push({key:uuidv4(),type:text,data:textClip})
        setNodeElmenteClip([...nodeElmenteClip])
        setText(textClip);
       
    }
    
    if(!textClip){
        const items = await clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item:any = items[i]
          if (item.type.indexOf('image') !== -1) {
            const blob = await item.getAsFile();
            blob && setImage(URL.createObjectURL(blob));
          } 
        }
    }
}
    
}
    return (
      <div contentEditable={true} onPaste={handlePaste}>
        {nodeElmenteClip.map(item=>{
            return(<p key={item.key}>{item.data}</p>)
        })}
        {image && <img src={image} alt="Pegado"/>}
      </div>
    )

};

export default ClipboardComponent