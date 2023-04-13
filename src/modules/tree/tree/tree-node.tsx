import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from './tree.data.interface'
import { TreeSubject } from './tree.subject'
import './tree-style.scss'

interface props<T = unknown> {
  data: TreeDataModel<T>
  render?: (renderProps: RenderTree<T>) => JSX.Element
  onChangeForDelete?: (id: string) => void
  treeNodeService: TreeSubject<TreeDataEvent<T>>
  initialClassName?: string
  subsitituteRowContend?: boolean
  arrayKeysEvents?: TreeKeyEvent[]
  confirmationChanges: boolean
}

function TreeNode<T = unknown> ({ onChangeForDelete, data, render, treeNodeService, initialClassName, subsitituteRowContend = false, arrayKeysEvents, confirmationChanges }: props<T>): JSX.Element {
  const [datatree, setDataTree] = useState<TreeDataModel<T>>(data)

  let suscriberResultAdd$: any

  const handleClikAddNode = (): void => {
    if (!Array.isArray(datatree.children)) {
      datatree.children = []
    }
    const newNode = createNewNode(datatree.level + 1, (datatree.children != null) ? datatree.children.length : 0 + 1)
    const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Create, TreeKeyEvent.ConfirmationCreate, newNode)
    treeNodeService.next(treeDataEvent)

    if (!confirmationChanges) {
      datatree.children?.push(newNode)
      datatree.hasChildren = true
      datatree.isOpen = true
      setDataTree({ ...datatree })
    }

    if (confirmationChanges) {
      suscriberResultAdd$ = treeNodeService.subscribe((data) => {
        if (data.event === TreeKeyEvent.ConfirmationCreate) {
          datatree.children?.push(newNode)
          datatree.hasChildren = true
          datatree.isOpen = true
          setDataTree({ ...datatree })
          if (suscriberResultAdd$ === undefined) { suscriberResultAdd$() }
        }
      })
    }
  }

  const createNewNode = (nivel: number, orden: number): TreeDataModel<T> => {
    return { id: uuidv4(), label: `${nivel}.${orden}`, parentId: datatree.id, isOpen: true, level: nivel, hasChildren: false, data: {} as any }
  }

  const handleClikDeleteNode = (): void => {
    if (onChangeForDelete != null) {
      onChangeForDelete(datatree.id)
    }
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any): void => {
    if (Array.isArray(datatree.children)) {
      const treeDataEvent = new TreeDataEvent<T>(TreeKeyEvent.Delete, TreeKeyEvent.ConfirmationDelete, retorno)
      treeNodeService.next(treeDataEvent)

      if (!confirmationChanges) {
        datatree.children = datatree.children?.filter((item: any) => item.id !== retorno)
        if (datatree.children?.length === 0) {
          datatree.hasChildren = false
        }
        setDataTree({ ...datatree })
      }

      if (confirmationChanges) {
        suscriberTreeNodeDeleteResultService$ = treeNodeService.subscribe((data) => {
          if (data.event === TreeKeyEvent.ConfirmationDelete) {
            datatree.children = datatree.children?.filter((item: any) => item.id !== retorno)
            if (datatree.children?.length === 0) {
              datatree.hasChildren = false
            }
            setDataTree({ ...datatree })
            if (suscriberTreeNodeDeleteResultService$ !== undefined) { suscriberTreeNodeDeleteResultService$() }
          }
        })
      }
    }
  }

  const handleclikChangeOpen = (): void => {
    datatree.isOpen = !datatree.isOpen
    setDataTree({ ...datatree })
  }

  const handleclikActionKey = (treeEventData: TreeKeyEvent): TreeDataEvent<T> => {
    console.log('EJECUTA ACCION NUEVA', treeEventData)
    return new TreeDataEvent<T>(treeEventData, TreeKeyEvent.ConfirmationDelete, datatree)
  }

  const onChange = (treeEventData: TreeDataEvent<T>): TreeDataEvent<T> => {
    switch (treeEventData.event) {
      case TreeKeyEvent.toggleExpand:
        handleclikChangeOpen()
        break
      case TreeKeyEvent.Create:
        handleClikAddNode()
        break
      case TreeKeyEvent.Delete:
        handleClikDeleteNode()
        break
      case TreeKeyEvent.Update:
        setDataTree(treeEventData.data)
        treeNodeService.next(treeEventData)
        break
      default:
        console.log('defualt event key action')
        break
    }
    return treeEventData
  }

  const treeEvent: RenderTree<T> = { onChange, data: datatree }

  useEffect(() => {
    return () => {
      if (suscriberResultAdd$ !== undefined) { suscriberResultAdd$() }
      if (suscriberTreeNodeDeleteResultService$ !== undefined) { suscriberTreeNodeDeleteResultService$() }
    }
  }, [])

  return (
    <li key={datatree.id} className={initialClassName}>

      {(render == null) &&
        <div className='ux-cotainer-row'>
          <div className='ux-control'>
            {datatree.hasChildren && <button className='ux-button' onClick={() => handleclikChangeOpen()}>{datatree.isOpen && '-'}{!datatree.isOpen && '+'}</button>}
            {!datatree.hasChildren && <div className='ux-item-control' />}
          </div>
          <div className='ux-item-contend'>
            {datatree.label}
          </div>
          <div className='ux-control'>
            <button className='ux-button' onClick={() => handleClikAddNode()}>ADD</button>
            <button className='ux-button' onClick={() => handleClikDeleteNode()}>DEL</button>
            {arrayKeysEvents?.map((item) => {
              return (<button key={item} className='ux-button' onClick={() => handleclikActionKey(item)}>{item}</button>)
            })}
          </div>
        </div>}

      {!subsitituteRowContend && (render != null) &&
        <div className='ux-cotainer-row'>
          <div className='ux-control'>
            {datatree.hasChildren && <button className='ux-button' onClick={() => handleclikChangeOpen()}>+</button>}
            {!datatree.hasChildren && <div className='ux-item-control' />}
          </div>
          <div className='ux-item-contend'>
            {render(treeEvent)}
          </div>
          <div className='ux-control'>
            <button className='ux-button' onClick={() => handleClikAddNode()}>ADD</button>
            <button className='ux-button' onClick={() => handleClikDeleteNode()}>DEL</button>
          </div>
        </div>}

      {subsitituteRowContend && (render != null) &&
        <div className='ux-cotainer-row'>
          <div className='ux-item-contend'>
            {render(treeEvent)}
          </div>
        </div>}

      {datatree.hasChildren &&
        <ul>
          {datatree.isOpen && datatree.hasChildren && datatree.children?.map((child: any) => {
            return (
              <TreeNode <T>
                key={child.id.toString()}
                data={child}
                render={render}
                onChangeForDelete={onChangeForDeleteRecibed}
                treeNodeService={treeNodeService}
                subsitituteRowContend={subsitituteRowContend}
                arrayKeysEvents={arrayKeysEvents}
                confirmationChanges={confirmationChanges}
              />
            )
          })}
        </ul>}
    </li>
  )
}
export default TreeNode
