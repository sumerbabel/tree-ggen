import { ChangeEvent, useEffect, useState } from 'react'
import { InputInterface } from './InputInterface'
import './input.component.scss/'
import FieldError from './field-error'

function InputComponent ({ id, label = 'Imput label', value = '', placeHolder = 'input data', errors, onChange, onChangeValue }: InputInterface): JSX.Element {
  const [inputProps, setInputProps] = useState<InputInterface>({
    id, label, value, placeHolder, errors
  })

  console.log('render hijo', inputProps, value)
  // console.log('inputProps', inputProps)
  // console.log('value', value)
  function handleOnChange (event: ChangeEvent<HTMLInputElement>): void {
    inputProps.value = event.target.value
    setInputProps({ ...inputProps })
    if (onChange !== undefined) { onChange(inputProps) }
    if (onChangeValue !== undefined) { onChangeValue(inputProps.value) }
  }

  useEffect(() => {
    console.log('entra al efecct', label, value)
    // setInputProps({ id, label, value, placeHolder, errors })
  }, [inputProps])

  return (<div className='sx-imput-comteiner'><span>{inputProps.label}</span><input value={inputProps.value} placeholder={inputProps.placeHolder} onChange={handleOnChange} /> <FieldError errors={inputProps.errors ?? []} /></div>)
}

export default InputComponent
