import { ChangeEvent, useState } from 'react'
import axios from 'axios'
import InputComponent from '../shared/components/input/input.component'
import { InputInterface } from '../shared/components/input/InputInterface'
import { LocalStorageKeys, saveInLocalStorage } from '../core/utilities/local-storage-manager'

const baseURL = 'http://localhost:81/api/login'
export interface UserProps {
  username_or_email: string
  password: string
}
function Login (): JSX.Element {
  const [userData, setUserData] = useState<UserProps>({} as any)

  function handleOnChangeValue (inputvalue: any): void {
    userData.username_or_email = inputvalue
    setUserData({ ...userData })
    console.log('inputDataValue', inputvalue)
  }

  function handleOnChangePassword (inputvalue: any): void {
    userData.password = inputvalue
    setUserData({ ...userData })
    console.log('inputDataValue', inputvalue)
  }

  function handleClikLogin (): void {
    axios.post(baseURL, userData).then((response: any) => {
      saveInLocalStorage(LocalStorageKeys.TOKEN, response.data.jwtClaims.token)
      console.log(response.data.jwtClaims.token)
      console.log(response.data.user.username)
    }).then(() => {}, () => {})
  }

  return (
    <div>
      <InputComponent onChangeValue={handleOnChangeValue} value={userData.username_or_email} label='Usuario' />
      <InputComponent onChangeValue={handleOnChangePassword} value={userData.password} label='Password' />
      <button onClick={handleClikLogin}>Acceder</button>
    </div>
  )
}

export default Login
