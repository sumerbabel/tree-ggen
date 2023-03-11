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
	  setTimeout(() => {
		TreeNodeAddResultService.setSubject(dataEvent);
	  }, 0)
	})

	const suscriptionTreeNodeDeleteService$ =TreeNodeDeleteService.getSubject().subscribe((dataEvent:any)=>{
	  setTimeout(() => {
		TreeNodeDeleteResultService.setSubject(dataEvent);
	  }, 0)
	})

	useEffect(()=>{return ()=>{
		subscription$.unsubscribe()
		suscriptionTreeNodeDeleteService$.unsubscribe()
	}},[])
  
	  const onChangeRecibedF=(retorno:any)=>{
	  console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
	  return onChange(retorno)
		}
	return (
	<div className="tree">
	<ul>
	<TreeNode  data={data}  onChange={onChangeRecibedF} onChangeForDelete={onChangeRecibedF}/>
	</ul>
	</div>	
	)
  }
  
  export default Tree