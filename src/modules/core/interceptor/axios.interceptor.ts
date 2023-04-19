import axios, { AxiosRequestConfig } from 'axios'
import { LocalStorageKeys, getInLocalStorage, saveInLocalStorage } from '../utilities/local-storage-manager'
import { spinnerService } from '../../spinner/sppimer.service'

export const AxiosInterceptor = (): void => {
  saveInLocalStorage(LocalStorageKeys.TOKEN, '123123123123')

  const updateHeader = (request: AxiosRequestConfig): AxiosRequestConfig<any> => {
    const token = getInLocalStorage(LocalStorageKeys.TOKEN)
    const newHeaders = {
      Authorization: token,
      'Content-Type': 'application/json'
    }
    request.headers = newHeaders
    return request
  }

  axios.interceptors.request.use((request: any) => {
    spinnerService.openSpinner()
    console.time()
    console.log('request')
    if (request.url?.includes('assets') !== undefined) return request
    return updateHeader(request)
  })

  axios.interceptors.response.use(
    (response) => {
      spinnerService.closeSpinner()
      console.timeEnd()
      console.log('response', response)
      return response
    },
    async (error) => {
      return await Promise.reject(error)
    }
  )
}
