import { useState } from 'react'
import { modalService } from '../modal/modal.service'

import Editor from './editor'
import Prism, { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css'

export function EditableComponent (): JSX.Element {
  const onInputChange = (onInputEvent: any): void => {
    console.log('HTML', onInputEvent.target.innerHTML)
    console.log('TEXT', onInputEvent.target.innerText)
    console.log('split', onInputEvent.target.innerText.split(' '))
  }

  const handleChangeCode = (evn: any): void => {
    console.log('evn.target.value', evn.target.value)
    setCode(evn.target.value)
  }

  const handleCLikModal = (): void => {
    modalService.openModal(<EditableComponent />).subscribe((data) => {
      console.log('data modal close', data)
    })
  }

  const handleCLikClose = (): void => {
    modalService.closeModal({ close: true, data: code })
  }

  const [code, setCode] = useState(
    'function add(a, b) {\n  return a + b;\n}'
  )

  return (
    <div>
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.js, 'javascript')}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12
        }} tabSize={0} insertSpaces={false} ignoreTabKey={false}
      />
      <button onClick={handleCLikModal}>Modal</button>
      <button onClick={handleCLikClose}>CloseModal</button>
      <button onClick={onInputChange}>input code</button>
      <button onClick={handleChangeCode}>code change</button>
    </div>

  )
}
