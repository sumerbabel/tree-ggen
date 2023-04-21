import { useEffect } from 'react'
import './toasts.scss'

export interface propsToasts {
  id: string
  item?: JSX.Element
  message: string
  timeClose: number
  deleteItemToasts: (id: string) => void
}
function Toasts ({ id, item, message = '', timeClose = 4000, deleteItemToasts }: propsToasts): JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      deleteItemToasts(id)
    }, timeClose)
  }, [])

  return (

    <div className='toasts-conteiner'>
      {(item === undefined && message !== '') && message}
      {(item !== undefined && message === '') && item}
      <button onClick={() => deleteItemToasts(id)}> X</button>
    </div>

  )
}

export default Toasts
