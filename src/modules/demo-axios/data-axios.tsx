import { useState } from 'react'
import axios from 'axios'
import InputComponent from '../shared/components/input/input.component'

const baseURL = 'http://localhost:81/api/login'
export interface UserProps {
  username_or_email: string
  password: string
}
function Data (): JSX.Element {
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
      console.log(response.data.jwtClaims.token)
      console.log(response.data.user.username)
    }).then(() => {}, () => {})
  }

  return (
    <div>
      <InputComponent onChangeValue={handleOnChangeValue} value={userData.username_or_email} label='Usuario' />
      <InputComponent onChangeValue={handleOnChangePassword} value={userData.password} label='Password' />
      <button onClick={handleClikLogin}>Get data</button>
    </div>
  )
}

export default Data
