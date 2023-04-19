import { ChangeEvent, useState } from 'react'
import axios from 'axios'
import InputComponent from '../shared/components/input/input.component'
import { InputInterface } from '../shared/components/input/InputInterface'

const baseURL = 'https://jsonplaceholder.typicode.com/posts/1'
export interface UserProps {
  username: string
  password: string
}
function Login (): JSX.Element {
  const [userData, setUserData] = useState<UserProps>({} as any)
  const [dataLabel, setLabe] = useState('label inicio')
  const label2 = 'pass'
  console.log('render padre', userData)
  function handleOnChange (inputData: InputInterface): void {
    console.log('inputData', inputData)
  }

  function handleOnChangeValue (inputvalue: any): void {
    userData.username = inputvalue
    setUserData({ ...userData })
    console.log('inputDataValue', inputvalue)
  }

  function handleOnChangePassword (inputvalue: any): void {
    userData.password = inputvalue
    setUserData({ ...userData })
    console.log('inputDataValue', inputvalue)
  }

  function handleClikLogin (): void {
    // console.log('inputDataValue', userData)
    // userData.password = ''
    // userData.username = ''
    // setUserData({ ...userData })
    // console.log('userData', userData)
    // label2 = 'NUEVO LABEL'
    setLabe(label2 + String(Math.random()))
  }

  return (
    <div>
      {dataLabel}
      <InputComponent onChangeValue={handleOnChangeValue} value={userData.username} label={dataLabel} />
      <InputComponent onChangeValue={handleOnChangePassword} value={userData.password} label='Password' />
      <button onClick={handleClikLogin}>Acceder</button>
    </div>
  )
}

export default Login
