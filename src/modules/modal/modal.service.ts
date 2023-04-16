import { Observable, Subject } from 'rxjs'

interface modalInterface {
  isOpen: boolean
  element?: JSX.Element
}
const subject$ = new Subject<modalInterface>()
let subjectDataModal$: Subject<any>
export const modalService = {
  openModal: (elementModal: JSX.Element): Observable<any> => {
    subject$.next({ isOpen: true, element: elementModal })
    subjectDataModal$ = new Subject<any>()
    return subjectDataModal$.asObservable()
  },
  closeModal: (data?: any) => {
    subjectDataModal$.next(data)
    subject$.next({ isOpen: false })
  },
  getModalSubject: () => subject$.asObservable(),
  getDataModelSubject: () => subjectDataModal$.asObservable()
}
