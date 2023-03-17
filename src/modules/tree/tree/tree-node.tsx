import { useEffect, useState,Children, ReactNode } from "react";
import { Subscriber } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { TreeNodeAddResultService } from "./tree-node-add-result-service";
import { TreeNodeAddService } from "./tree-node-add-service";
import { TreeNodeDeleteResultService } from "./tree-node-delete-result-service";
import { TreeNodeDeleteService } from "./tree-node-delete-service copy";
import "./tree-style.scss";
interface props {
  onChange: (data: any) => void
  onChangeForDelete: (data: any) => void
  data: any
  render: (data: any) => JSX.Element
}

function TreeNode({ onChange, onChangeForDelete, data,render }: props) {

  console.log('render',render)
  const [datatree, setDataTree] = useState(data);
  let suscriberResultAdd$: any

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const newNode = createNewNode(datatree.level + 1, datatree.children.length + 1)

    TreeNodeAddService.setSubject(newNode);

    suscriberResultAdd$ = TreeNodeAddResultService.getSubject().subscribe(() => {
      datatree['children'].push(newNode)
      datatree.hasChildren = true

      setDataTree({ ...datatree })
      if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() }
    })
    
  }

  const createNewNode = (nivel: number, orden: number) => {
    return { id: uuidv4(), label: 'nueva  rdsfsdf sdfsdfsdf kjsdhfkjsdhfkjsdhf mskjdhfkjsdhfkjsd jhsdkjfhsdkjfhsdkjf shjkjfdhkjshfkjsdhf  sjhdgfsdhkfjhsdkf' + nivel + '.' + orden, parentId: datatree.id, isOpen: true, level: nivel, routeDrawBranch:"" }
  }

  const handleClikDeleteNode = () => {
    onChangeForDelete(datatree.id)
  }

  const handleclikChangeOpen = () => {
    datatree.isOpen =!datatree.isOpen
    setDataTree({ ...datatree})
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any) => {

    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      TreeNodeDeleteService.setSubject(retorno)
      suscriberTreeNodeDeleteResultService$ = TreeNodeDeleteResultService.getSubject().subscribe(() => {

        datatree['children'] = datatree['children'].filter((item: any) => item.id != retorno)
        if (datatree['children'].length === 0) {
          datatree.hasChildren = false
        }
        setDataTree({ ...datatree })

        if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe() }

      })

    }
  }

  const onChangeRecibed = (retorno: any) => { return onChange(retorno) }

  
  useEffect(() => {
    return () => {
      if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() }
      if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe() }
    }
  }, [])

  return (
    <li key={datatree.id}>
      <div className="ux-cotainer-row">
        <div className="ux-control">
          {datatree.hasChildren && <button className="ux-button" onClick={() => handleclikChangeOpen()} >+</button>}
          {!datatree.hasChildren && <div className="ux-item-control" ></div>}
        </div>
        <div className="ux-item-contend">
        {render(datatree)}
          {/* {!children && datatree.label}
          {children && children} */}
        </div>
        <div className="ux-control">
          <button className="ux-button" onClick={() => handleClikAddNode()} >ADD</button>
          <button className="ux-button" onClick={() => handleClikDeleteNode()} >DEL</button>
        </div>
      </div>

      {datatree.hasChildren && <ul>
        {datatree.isOpen && datatree.hasChildren && datatree.children.map((child: any) => {
          return (
            <TreeNode
              key={child.id.toString()}
              data={child}
              render={render}
              onChangeForDelete={onChangeForDeleteRecibed}
              onChange={onChangeRecibed}
            />
          )
        })}
      </ul>}

    </li> 
  );
};

export default TreeNode;