import { useEffect, useState } from 'react'
import { toastsService } from './toasts.service'
import Toasts from './toasts'
import { v4 as uuidv4 } from 'uuid'

function ToastsConteiner (): JSX.Element {
  const [toasts, setToasts] = useState<any[]>([])

  useEffect(() => {
    const suscriberToasts = toastsService.getSubject().subscribe((item) => {
      if (item.isOpen) {
        toasts.push({ id: uuidv4(), item: item.element, message: item.message, autoClose: item.autoClose, timeCLose: item.timeCLose })
      } else {
        toasts.pop()
      }
      setToasts([...toasts])
    })

    return () => {
      suscriberToasts.unsubscribe()
    }
  }, [toasts])

  const deleteItemToasts = (id: string): void => {
    if (id !== undefined) {
      setToasts(toasts.filter((toast) => toast.id !== id))
    }
  }

  return (
    <>{toasts.map((item) => { return (<Toasts key={item.id} id={item.id} item={item.item} message={item.message} deleteItemToasts={deleteItemToasts} timeClose={item.timeClose} />) })}
    </>
  )
};

export default ToastsConteiner
