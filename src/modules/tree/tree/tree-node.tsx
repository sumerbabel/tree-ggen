import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TreeData, TreeDataModel, TreeEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";
import "./tree-style.scss";

interface props<T> {
  data: TreeDataModel<T>
  render?: (dataRender: any) => JSX.Element
  onChangeForDelete?: (id: string) => void
  treeNodeService: TreeSubject<TreeData<T>>
  initialClassName?:string
}

function TreeNode<T>({ onChangeForDelete, data, render, treeNodeService,initialClassName }: props<T>) {
  const [datatree, setDataTree] = useState<TreeDataModel<T>>(data)

  let suscriberResultAdd$: any

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const newNode = createNewNode(datatree.level + 1, datatree.children? datatree.children.length:0 + 1)

    treeNodeService.next({ event: TreeEvent.Create, eventConfirmation: TreeEvent.ConfirmationCreate, data: newNode })

    suscriberResultAdd$ = treeNodeService.subscribe((data) => {
      if (data.event === TreeEvent.ConfirmationCreate) {
        datatree.children?.push(newNode)
        datatree.hasChildren = true
        setDataTree({ ...datatree })
        if (suscriberResultAdd$) { suscriberResultAdd$() }
      }
    })
  }

  const createNewNode = (nivel: number, orden: number):TreeDataModel<T> => {
    return { id: uuidv4(), label: uuidv4() + nivel + '.' + orden, parentId: datatree.id, isOpen: true, level: nivel,hasChildren:false, data:{}as T}
  }

  const handleClikDeleteNode = () => {
    if (onChangeForDelete) {
      onChangeForDelete(datatree.id)
    }
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any) => {
    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      treeNodeService.next({ event: TreeEvent.Delete, eventConfirmation: TreeEvent.ConfirmationDelete, data: retorno })
      suscriberTreeNodeDeleteResultService$ = treeNodeService.subscribe((data) => {
        
        if (data.event === TreeEvent.ConfirmationDelete) {
          datatree['children'] = datatree['children']?.filter((item: any) => item.id != retorno)
          if (datatree['children']?.length === 0) {
            datatree.hasChildren = false
          }
          setDataTree({ ...datatree })
          if (suscriberTreeNodeDeleteResultService$) { suscriberTreeNodeDeleteResultService$() }
        }
      })
      
    }
  }
  
  const handleclikChangeOpen = () => {
    datatree.isOpen = !datatree.isOpen
    setDataTree({ ...datatree })
  }

  useEffect(() => {
    return () => {
      if (suscriberResultAdd$ ) { suscriberResultAdd$() }
      if (suscriberTreeNodeDeleteResultService$ ) { suscriberTreeNodeDeleteResultService$() }
    }
  }, [])

  return (
    <li key={datatree.id} className={initialClassName}>
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
        {datatree.isOpen && datatree.hasChildren && datatree.children?.map((child: any) => {
          return (
            <TreeNode <T>
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
  )
}

export default TreeNode;