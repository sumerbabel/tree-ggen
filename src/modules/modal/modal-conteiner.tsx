import { useEffect, useState } from 'react'
import { modalService } from './modal.service'
import Modal from './modal'

function ModalConteiner (): JSX.Element {
  const [modals, setModals] = useState<any[]>([])

  useEffect(() => {
    const suscriberModal = modalService.getModalSubject().subscribe((item) => {
      if (item.isOpen) {
        modals.push(item.element)
      } else {
        modals.pop()
      }

      setModals([...modals])
    })

    return () => {
      suscriberModal.unsubscribe()
    }
  }, [modals])

  return (
    <>{modals.map((item, index) => { return (<Modal key={index} item={item} />) })}</>
  )
}

export default ModalConteiner
