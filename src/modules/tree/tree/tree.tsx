import { useEffect } from "react";
import TreeNode from "./tree-node";
import { treeService } from "./tree-service";
interface props
{	onChange:(data:any)=>void
	data:any
}
  function Tree ({onChange,data}:props) {

	 const subscription$ = treeService.getSubject().subscribe((dataEvent:any)=>{
	  if(dataEvent['action'] =='add'){
		console.log('data original', data)
		setTimeout(() => {
		  treeService.setSubject({action:'add-ok', data :dataEvent['data']});
		}, 300)
	  }
	})

	useEffect(()=>{return ()=>{subscription$.unsubscribe()}},[])
  
	  const onChangeRecibedF=(retorno:any)=>{
	  console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
	  return onChange(retorno)
		}
	return (<TreeNode data={data}  onChange={onChangeRecibedF} onChangeForDelete={onChangeRecibedF}/>)
  }
  
  export default Tree