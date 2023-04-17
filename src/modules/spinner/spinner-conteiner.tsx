import { useEffect, useState } from 'react'
import Spinner from './spinner'
import { spinnerService } from './sppimer.service'

function SpinnerConteiner (): JSX.Element {
  const [isOpenSpinner, setIsOpenSpinner] = useState<boolean>(false)

  useEffect(() => {
    const suscriber = spinnerService.getSpinnerSubject().subscribe((isOpen) => {
      setIsOpenSpinner(isOpen)
    })
    return () => {
      suscriber.unsubscribe()
    }
  }, [isOpenSpinner])

  return (
    <>{isOpenSpinner && <Spinner />}</>
  )
};

export default SpinnerConteiner
