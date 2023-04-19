
export enum LocalStorageKeys {
  REFRESH_TOKEN = 'refreshToken',
  TOKEN = 'token',
}

export const saveInLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

export const getInLocalStorage = (key: string): any => {
  const result = localStorage.getItem(key)
  if (!(result !== undefined)) {
    return JSON.parse(result)
  }
  return ''
}

export const clearLocalStorage = (): void => {
  localStorage.clear()
}
