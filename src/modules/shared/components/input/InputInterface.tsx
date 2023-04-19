export interface InputInterface {
  id?: string
  label?: string
  value?: string
  placeHolder?: string
  errors?: []
  onChange?: (inputData: InputInterface) => void
  onChangeValue?: (value: any) => void
}
