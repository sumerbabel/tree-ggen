import { useEffect, useState } from "react";
import { Subscriber } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { TreeNodeAddResultService } from "./tree-node-add-result-service";
import { TreeNodeAddService } from "./tree-node-add-service";
import { TreeNodeDeleteResultService } from "./tree-node-delete-result-service";
import { TreeNodeDeleteService } from "./tree-node-delete-service copy";

interface props {
  onChange: (data: any) => void
  onChangeForDelete: (data: any) => void
  data: any
}

function TreeNode({ onChange, onChangeForDelete: onChangeForDeleteNode, data }: props) {

  const [datatree, setDataTree] = useState(data);
  let suscriberResultAdd$: any

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const orden = datatree.children.length + 1
    const nivel = datatree.level + 1
    const newNode = { id: uuidv4(), label: 'nueva ' + nivel + '.' + orden, parentId: datatree.id, isOpen:true, level:nivel }

    TreeNodeAddService.setSubject(newNode);
    suscriberResultAdd$ = TreeNodeAddResultService.getSubject().subscribe((data: any) => {
      console.log('suscriber de respuesta',data)
      if ( data.id === newNode.id) {
        datatree['children'].push(newNode)
        setDataTree({ ...datatree })
      }
      if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() }
    })
  }

  const handleClikDeleteNode = () => {
    onChangeForDeleteNode(datatree.id)
  }

 

 
  const handleclikChangeOpen = () => {
    setDataTree({ ...datatree, isOpen:!datatree['isOpen'] })
  }

  const flechas = 'o' + '-'.repeat(datatree.level * 3) + '-> ';



  let suscriberTreeNodeDeleteResultService$:any
  const onChangeForDeleteRecibed = (retorno: any) => {


    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      TreeNodeDeleteService.setSubject(retorno)
      suscriberTreeNodeDeleteResultService$ = TreeNodeDeleteResultService.getSubject().subscribe((dataResult:any)=>{

        datatree['children'] = datatree['children'].filter((item:any) => item.id != retorno)
        setDataTree({ ...datatree })

        if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe()}

      })
      
    }
  }

  const onChangeRecibed = (retorno: any) => { return onChange(retorno) }

  useEffect(() => { return () => {
    if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() } 
    if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe() } 
  
  } }, [])

  return (
    <div style={{ "backgroundColor": 'gray' }} key={datatree.id}>
     {
      Array.isArray(datatree['children']) && datatree.children.length > 0 && <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleclikChangeOpen()} >+</button>
     }
      <span style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px", fontWeight: 700 }}>{flechas}{datatree.level}</span>
      <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleClikAddNode()} >ADD</button>
      <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleClikDeleteNode()} >DEL</button>
      {datatree.level} -{datatree.label} -- {String(datatree.isOpen)}
      {datatree.isOpen && datatree.children && datatree.children.map((child: any) => {
        return (
          <TreeNode
            key={child.id.toString()}
            data={child}
            onChangeForDelete={onChangeForDeleteRecibed}
            onChange={onChangeRecibed}
          />
        )
      })}
    </div>
  );
};

export default TreeNode;