import { Observable, Subject } from 'rxjs'
interface toastsInterface {
  isOpen: boolean
  message: string
  element?: JSX.Element
  autoClose?: boolean
  timeCLose?: number
}
const subject$ = new Subject<toastsInterface>()
let subjectDataToasts$: Subject<any>
export const toastsService = {
  open: (message: string, elementToasts?: JSX.Element, autoClose: boolean = true, timeCLose?: number): Observable<any> => {
    subject$.next({ isOpen: true, message, element: elementToasts, autoClose, timeCLose })
    subjectDataToasts$ = new Subject<any>()
    return subjectDataToasts$.asObservable()
  },
  close: (data?: any) => {
    subjectDataToasts$.next(data)
    subject$.next({ isOpen: false, message: 'close' })
  },
  getSubject: () => subject$.asObservable(),
  getDataModelSubject: () => subjectDataToasts$.asObservable()
}
