import './modal.scss'
export interface propsModal {
  item: JSX.Element
}
function Modal ({ item }: propsModal): JSX.Element {
  return (
    <div className='modal-content'>
      <div className='modal-conteiner'>
        {item}
      </div>
    </div>
  )
}

export default Modal
