import { ChangeEvent } from 'react'
import { InputInterface } from './InputInterface'
import './input.component.scss/'
import FieldError from './field-error'

function InputComponent ({ id, label = 'Imput label', value = '', placeHolder = 'input data', errors, onChange, onChangeValue }: InputInterface): JSX.Element {
  function handleOnChange (event: ChangeEvent<HTMLInputElement>): void {
    value = event.target.value
    if (onChange !== undefined) { onChange({ id, label, value, placeHolder, errors }) }
    if (onChangeValue !== undefined) { onChangeValue(value) }
  }

  return (<div className='sx-imput-comteiner'><span>{label}</span><input value={value} placeholder={placeHolder} onChange={handleOnChange} /> <FieldError errors={errors ?? []} /></div>)
}

export default InputComponent
