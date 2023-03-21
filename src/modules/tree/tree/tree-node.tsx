import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./tree-style.scss";
import { useTreeContext } from "./tree.context";
import { TreeData, TreeEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";

interface props {
  data: any
  render?: (data: any) => JSX.Element
  onChangeForDelete?: (data: any) => void
  treeNodeService: TreeSubject<TreeData>
}

function TreeNode({ onChangeForDelete, data, render, treeNodeService }: props) {
  const [datatree, setDataTree] = useState(data);
  const {setEventContext, getValueContext , confirmationEvent} =useTreeContext()
  let suscriberResultAdd$: any

  const miCallback = useCallback(() => {
    console.log("Ejecutando callback desde el componente hijo");
  }, []);

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const newNode = createNewNode(datatree.level + 1, datatree.children.length + 1)


    setEventContext(TreeEvent.Create)

 

    confirmationEvent(miCallback)

    treeNodeService.next({ event: TreeEvent.Create, eventConfirmation: TreeEvent.ConfirmationCreate, data: newNode });

    suscriberResultAdd$ = treeNodeService.subscribe((data) => {
      if (data.event === TreeEvent.ConfirmationCreate) {
        datatree['children'].push(newNode)
        datatree.hasChildren = true
        setDataTree({ ...datatree })
        if (suscriberResultAdd$) { suscriberResultAdd$() }
      }
    })
  }

  const createNewNode = (nivel: number, orden: number) => {
    return { id: uuidv4(), label: uuidv4() + nivel + '.' + orden, parentId: datatree.id, isOpen: true, level: nivel, routeDrawBranch: "" }
  }

  const handleClikDeleteNode = () => {
    if (onChangeForDelete) {
      onChangeForDelete(datatree.id)
    }
  }

  const handleclikChangeOpen = () => {
    datatree.isOpen = !datatree.isOpen
    setDataTree({ ...datatree })
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any) => {
    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      treeNodeService.next({ event: TreeEvent.Delete, eventConfirmation: TreeEvent.ConfirmationDelete, data: retorno })
      suscriberTreeNodeDeleteResultService$ = treeNodeService.subscribe((data) => {

        if (data.event === TreeEvent.ConfirmationDelete) {
          datatree['children'] = datatree['children'].filter((item: any) => item.id != retorno)
          if (datatree['children'].length === 0) {
            datatree.hasChildren = false
          }
          setDataTree({ ...datatree })
          if (suscriberTreeNodeDeleteResultService$) { suscriberTreeNodeDeleteResultService$() }
        }
      })

    }
  }

  useEffect(() => {
    return () => {
      if (suscriberResultAdd$ ) { suscriberResultAdd$() }
      if (suscriberTreeNodeDeleteResultService$ ) { suscriberTreeNodeDeleteResultService$() }
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
          {!render && datatree.label}
          {render && render(datatree)}
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
              treeNodeService={treeNodeService}
            />
          )
        })}
      </ul>}
    </li>
  );
};

export default TreeNode;