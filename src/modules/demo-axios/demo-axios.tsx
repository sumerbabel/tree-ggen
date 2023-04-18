import { useState } from 'react'
import axios from 'axios'
export interface resultType {
  userId: number
  id: number
  title: string
  body: string
}
const baseURL = 'https://jsonplaceholder.typicode.com/posts/1'
function DemoAxios (): JSX.Element {
  const [post, setPost] = useState<resultType>({
    userId: 0,
    id: 0,
    title: 'nan',
    body: 'bod'
  })

  const getaxios = async (): Promise<void> => {
    await axios.get(baseURL).then((result: any) => {
      console.log(result.data)
      setPost(result.data)
    })
  }

  function inputChange (element: any): void {
    console.log(element.target.value)
    post.title = element.target.value
    setPost({ ...post })
  }

  function inputChange2 (element: any): void {
    console.log(element.target.value)
    post.body = element.target.value
    setPost({ ...post })
  }

  async function handleEnviar (element: any): Promise<void> {
    console.log('data a enviar', post)
    const baseURL2 = 'https://crudcrud.com/api/ce422db26226498383c655e48c6e0573/unicorns'
    await axios.post(baseURL2, { name: 'Sparkle Angel', age: 2, colour: 'blue' }).then((response: any) => { setPost(response.data) })
  }

  return (
    <div><h1>{post.title}</h1><p>{post.body}</p><button onClick={getaxios}> AXIOSS GET</button>
      <div>
        <input onChange={inputChange} value={post.title} />
        <input onChange={inputChange2} value={post.body} />
        <button onClick={handleEnviar}>Enviar</button>
      </div>
    </div>
  )
}

export default DemoAxios
