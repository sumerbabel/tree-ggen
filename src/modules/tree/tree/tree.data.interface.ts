
import { TreeSubject } from "./tree.subject"

export enum TreeEvent {
  Create = "CREATE",
  ConfirmationCreate = "CONFIRMATION_CREATE",
  Update = "UPDATE",
  ConfirmationUpdate = "CONFIRMATION_UPDATE",
  Delete = "DELETE",
  ConfirmationDelete = "CONFIRMATION_DELETE",
  Read = "READ",
}

export interface TreeData {
  event: TreeEvent
  eventConfirmation: TreeEvent
  data: any
}

export interface TreeEventData<T> {
  treeData: TreeData
  subject: TreeSubject<T>
}