import { Record } from './Record'

export interface History {
  stack: Array<Record & { timestamp: number }>
  offset: number
}
