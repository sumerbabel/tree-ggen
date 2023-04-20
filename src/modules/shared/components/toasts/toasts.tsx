import { useEffect } from 'react'
import './toasts.scss'

export interface propsToasts {
  id: number
  item?: JSX.Element
  message: string
  timeClose: number
  deleteItemToasts: (id: number) => void
}
function Toasts ({ id, item, message = '', timeClose = 4000, deleteItemToasts }: propsToasts): JSX.Element {
  useEffect(() => {
    console.log('timeClose', timeClose)
    const interval = setInterval(() => {
      deleteItemToasts(id)
    }, timeClose)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='modal-content'>
      <div className='modal-conteiner'>
        {(item === undefined && message !== '') && message}
        {(item !== undefined && message === '') && item}
      </div>
    </div>
  )
}

export default Toasts
