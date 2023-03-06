
import './App.css'
import Tree from './modules/tree/tree/tree'
import { DATA } from './modules/tree/tree/tree.data'
function App() {
  const data = DATA
  const onChangeRecibedF = (retorno: any) => {
    console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
  }
  return (
    <div>
      <Tree data={data} onChange={onChangeRecibedF} />

      <div className='ux-main-container'>
        main
        <div className='ux-parent-container'>
          parent
          <div className='ux-child-container'>
            child
            <div className='ux-contend'>
              <div className='ux-control'>
                <div className='ux-item-control'>1</div>
                <button>B1</button>
                <div className='ux-item-control'>2</div>
                </div><div className='ux-item-contend'>contend</div>
                <div className='ux-control'>
                  <div className='ux-item-control'>1</div>
                  <button>B1</button>
                  <div className='ux-item-control'>2</div>
                </div>
            </div>
          </div>

        </div>

      </div>


    </div>

  )
}
export default App
