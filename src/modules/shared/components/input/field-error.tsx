import { useState } from 'react'

export function FieldError ({ errors = [] }: { errors: [] }): JSX.Element {
  const [fieldErrors] = useState(errors)

  return (
    <>{(fieldErrors.length > 0) && <div className='sx-field-error'>{fieldErrors.map((item, index) => { return (<span key={index}>{item}</span>) })} </div>}</>

  )
}

export default FieldError
