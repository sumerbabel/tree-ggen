import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import CodeEditor from '@uiw/react-textarea-code-editor';
interface editableProps{

}

export function EditableComponent() {

    const [childArrayComp, setDataEdit] = useState([{id:uuidv4(),data:'dato1'}]);
    const onInputChange =(onInputEvent:any)=>{
       console.log('HTML',onInputEvent.target.innerHTML);
       console.log('TEXT',onInputEvent.target.innerText);
       console.log('split',onInputEvent.target.innerText.split(" "));
       const arraysplit =onInputEvent.target.innerText.split(" ")
     
       createcoMP(arraysplit)
    }

    function createcoMP(data:any[]){

     let datos = data.map(item => { 
        return {id:uuidv4(),data:item}
       })

       console.log('datos', datos)
      setDataEdit(datos)
    }

    const [code, setCode] =useState(
      `function add(a, b) {\n  return a + b;\n}`
    );

    return (
      <div className="edit-comp1">
            <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
    
      <div className="edit-comp" contentEditable="true" suppressContentEditableWarning={true}
           onInput={onInputChange}>
            {childArrayComp.map(item=>{
              return(<span className="span-comp" key={item.id}>{item.data}</span>)
            })}
      </div>
      
      </div>

     )
  }
  


  