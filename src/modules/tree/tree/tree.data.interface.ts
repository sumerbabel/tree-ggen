
export enum TreeKeyEvent {
  Create = "CREATE",
  ConfirmationCreate = "CONFIRMATION_CREATE",
  Update = "UPDATE",
  ConfirmationUpdate = "CONFIRMATION_UPDATE",
  Delete = "DELETE",
  ConfirmationDelete = "CONFIRMATION_DELETE",
  toggleExpand ="TOGGLE_EXPAND",
  Read = "READ",
}


export interface TreeData<T> {
  event: TreeKeyEvent
  eventConfirmation: TreeKeyEvent
  data: TreeDataModel<T>
}


export class TreeDataEvent<T = unknown>{ 
  public event: TreeKeyEvent
  public eventConfirmation: TreeKeyEvent
  public data: TreeDataModel<T>
  constructor( treeEvent: TreeKeyEvent,  TreeEventConfirmation: TreeKeyEvent,  dataModel: TreeDataModel<T>) { 
    this.event=treeEvent
    this.eventConfirmation =TreeEventConfirmation
    this.data =dataModel
  } 
  public getTreDataEventConfirmation(dataModel: TreeDataModel<T> =this.data):TreeDataEvent<T>{
    
    return new TreeDataEvent(this.eventConfirmation,this.event,dataModel)
  }
}

export interface TreeDataModel<T = unknown> {
  id: string
  label: string
  parentId: string
  isOpen: boolean
  level: number
  hasChildren: boolean
  data: T
  children?: TreeDataModel<T>[]
}


export interface RenderTree<T = unknown> {
	onChange: (treeEventData: TreeDataEvent<T>) => any
	data: TreeDataModel<T>
}