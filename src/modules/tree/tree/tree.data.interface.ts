export enum TreeEvent {
  Create = "CREATE",
  ConfirmationCreate = "CONFIRMATION_CREATE",
  Update = "UPDATE",
  ConfirmationUpdate = "CONFIRMATION_UPDATE",
  Delete = "DELETE",
  ConfirmationDelete = "CONFIRMATION_DELETE",
  Read = "READ",
}

export interface TreeData<T> {
  event: TreeEvent
  eventConfirmation: TreeEvent
  data: TreeDataModel<T>
}

export interface TreeDataModel<T>{
  id: string
  label: string
  parentId:string
  isOpen:boolean
  level:number
  hasChildren:boolean
  data:T
  children?: TreeDataModel<T>[]
}

