import axios, { AxiosRequestConfig } from 'axios'
import { LocalStorageKeys, getInLocalStorage, saveInLocalStorage } from '../utilities/local-storage-manager'
import { spinnerService } from '../../spinner/sppimer.service'
import { toastsService } from '../../shared/components/toasts/toasts.service'

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
    if (request.url?.includes('assets') !== undefined) return request
    return updateHeader(request)
  })

  axios.interceptors.response.use(
    (response) => {
      spinnerService.closeSpinner()
      return response
    },
    async (error) => {
      spinnerService.closeSpinner()
      toastsService.open(error.response.data)
      // console.log(error.response.data)
      return await Promise.reject(error)
    }
  )
}
