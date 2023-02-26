import { useEffect } from "react";
import TreeNode from "./tree-node";
import { TreeNodeAddService } from "./tree-node-add-service";
import { TreeNodeAddResultService } from "./tree-node-add-result-service";
import { TreeNodeDeleteService } from "./tree-node-delete-service copy";
import { TreeNodeDeleteResultService } from "./tree-node-delete-result-service";
interface props
{	onChange:(data:any)=>void
	data:any
}
  function Tree ({onChange,data}:props) {

	 const subscription$ = TreeNodeAddService.getSubject().subscribe((dataEvent:any)=>{
		console.log('dataEvent',dataEvent)
	  setTimeout(() => {
		TreeNodeAddResultService.setSubject(dataEvent);
	  }, 300)
	})

	const suscriptionTreeNodeDeleteService$ =TreeNodeDeleteService.getSubject().subscribe((dataEvent:any)=>{
		console.log('dataEvent delete',dataEvent)
	  setTimeout(() => {
		TreeNodeDeleteResultService.setSubject(dataEvent);
	  }, 300)
	})

	useEffect(()=>{return ()=>{
		subscription$.unsubscribe()
		suscriptionTreeNodeDeleteService$.unsubscribe()
	}},[])
  
	  const onChangeRecibedF=(retorno:any)=>{
	  console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
	  return onChange(retorno)
		}
	return (<TreeNode data={data}  onChange={onChangeRecibedF} onChangeForDelete={onChangeRecibedF}/>)
  }
  
  export default Tree