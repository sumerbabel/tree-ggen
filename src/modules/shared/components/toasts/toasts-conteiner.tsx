import { useEffect, useState } from 'react'
import { toastsService } from './toasts.service'
import Toasts, { propsToasts } from './toasts'

function ToastsConteiner (): JSX.Element {
  const [toasts, setToasts] = useState<propsToasts[]>([] as any)

  useEffect(() => {
    const suscriberToasts = toastsService.getSubject().subscribe((item) => {
      if (item.isOpen) {
        toasts.push({ item: item.element, message: item.message, autoClose: item.autoClose, timeCLose: item.timeCLose })
      } else {
        toasts.pop()
      }

      setToasts([...toasts])
    })

    return () => {
      suscriberToasts.unsubscribe()
    }
  }, [toasts])

  const deleteItemToasts = (id: number): void => {
    console.log('ejejcuta funcion delete')
    // console.log(toasts, id)
    if (id !== undefined) {
      setToasts(toasts.splice(id, 1))
    }

    console.log('slice', toasts, id)
  }

  return (
    <>{toasts.map((item, index) => { return (<Toasts key={index} id={index} item={item.item} message={item.message} deleteItemToasts={deleteItemToasts} timeClose={item.timeClose} />) })}</>
  )
};

export default ToastsConteiner
