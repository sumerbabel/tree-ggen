import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";
import "./tree-style.scss";

interface props<T = unknown> {
  data: TreeDataModel<T>
  render?: (renderProps: RenderTree<T>) => JSX.Element
  onChangeForDelete?: (id: string) => void
  treeNodeService: TreeSubject<TreeDataEvent<T>>
  initialClassName?: string
  complete_subsititute_row_contend?:boolean
  arrayKeysEvents?:TreeKeyEvent[]
}

function TreeNode<T = unknown>({ onChangeForDelete, data, render, treeNodeService, initialClassName, complete_subsititute_row_contend,arrayKeysEvents }: props<T>) {
  const [datatree, setDataTree] = useState<TreeDataModel<T>>(data)

  let suscriberResultAdd$: any

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const newNode = createNewNode(datatree.level + 1, datatree.children ? datatree.children.length : 0 + 1)
    const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationCreate, newNode)
    treeNodeService.next(treeDataEvent)

    suscriberResultAdd$ = treeNodeService.subscribe((data) => {
      if (data.event === TreeKeyEvent.ConfirmationCreate) {
        datatree.children?.push(newNode)
        datatree.hasChildren = true
        setDataTree({ ...datatree })
        if (suscriberResultAdd$) { suscriberResultAdd$() }
      }
    })
  }

  const createNewNode = (nivel: number, orden: number): TreeDataModel<T> => {
    return { id: uuidv4(), label: uuidv4() + nivel + '.' + orden, parentId: datatree.id, isOpen: true, level: nivel, hasChildren: false, data: {} as T }
  }

  const handleClikDeleteNode = () => {
    if (onChangeForDelete) {
      onChangeForDelete(datatree.id)
    }
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any) => {
    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationDelete, retorno)
      treeNodeService.next(treeDataEvent)
      suscriberTreeNodeDeleteResultService$ = treeNodeService.subscribe((data) => {

        if (data.event === TreeKeyEvent.ConfirmationDelete) {
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

  const handleclikActionKey= (treeEventData: TreeKeyEvent) => {
          console.log('EJECUTA ACCION NUEVA', treeEventData)
          return new TreeDataEvent<T>(treeEventData, TreeKeyEvent.ConfirmationDelete, datatree)
  }

  const onChange = (treeEventData: TreeDataEvent<T>) => {
    switch (treeEventData.event) {
      case TreeKeyEvent.toggleExpand:
        handleclikChangeOpen()
        break;
      case TreeKeyEvent.Create:
        handleClikAddNode()
        break;
      case TreeKeyEvent.Delete:
        handleClikDeleteNode()
        break;
      default:
        
        break;
    }
    return treeEventData
  }

  const treeEvent: RenderTree<T> = { onChange, data: datatree } as RenderTree<T>

  useEffect(() => {
    return () => {
      if (suscriberResultAdd$) { suscriberResultAdd$() }
      if (suscriberTreeNodeDeleteResultService$) { suscriberTreeNodeDeleteResultService$() }
    }
  }, [])

  return (
    <li key={datatree.id} className={initialClassName}>

      {!render && <div className="ux-cotainer-row">
        <div className="ux-control">
          {datatree.hasChildren && <button className="ux-button" onClick={() => handleclikChangeOpen()} >+</button>}
          {!datatree.hasChildren && <div className="ux-item-control" ></div>}
        </div>
        <div className="ux-item-contend">
          {datatree.label}
        </div>
        <div className="ux-control">
          <button className="ux-button" onClick={() => handleClikAddNode()} >ADD</button>
          <button className="ux-button" onClick={() => handleClikDeleteNode()} >DEL</button>
          {arrayKeysEvents?.map((item)=>{
           return(<button key={item} className="ux-button" onClick={() => handleclikActionKey(item)} >{item}</button>) 
          })}
        </div>
      </div>}

      {!complete_subsititute_row_contend && render && <div className="ux-cotainer-row">
        <div className="ux-control">
          {datatree.hasChildren && <button className="ux-button" onClick={() => handleclikChangeOpen()} >+</button>}
          {!datatree.hasChildren && <div className="ux-item-control" ></div>}
        </div>
        <div className="ux-item-contend">
            {render(treeEvent)}
        </div>
        <div className="ux-control">
          <button className="ux-button" onClick={() => handleClikAddNode()} >ADD</button>
          <button className="ux-button" onClick={() => handleClikDeleteNode()} >DEL</button>
        </div>
      </div>}


      {complete_subsititute_row_contend && render && <div className="ux-cotainer-row">
        <div className="ux-item-contend">
          {render(treeEvent)}
        </div>
      </div>}


      {datatree.hasChildren && <ul>
        {datatree.isOpen && datatree.hasChildren && datatree.children?.map((child: any) => {
          return (
            <TreeNode <T>
              key={child.id.toString()}
              data={child}
              render={render}
              onChangeForDelete={onChangeForDeleteRecibed}
              treeNodeService={treeNodeService}
              complete_subsititute_row_contend={complete_subsititute_row_contend}
              arrayKeysEvents={arrayKeysEvents}
            />
          )
        })}
      </ul>}
    </li>
  )
}

export default TreeNode;