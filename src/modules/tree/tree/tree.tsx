import { useEffect } from "react";
import TreeNode from "./tree-node";
import { TreeNodeAddService } from "./tree-node-add-service";
import { TreeNodeAddResultService } from "./tree-node-add-result-service";
import { TreeNodeDeleteService } from "./tree-node-delete-service";
import { TreeNodeDeleteResultService } from "./tree-node-delete-result-service";
import "./tree-style.scss";

interface props {
	onChange: (data: any) => void
	data: any
	render?: (data: any) => JSX.Element
}
function Tree({ onChange, data, render }: props) {

	const subscription$ = TreeNodeAddService.getSubject().subscribe((dataEvent: any) => {
		setTimeout(() => {
			//TreeNodeAddResultService.setSubject(dataEvent);
			onChange({ event: 'ADD_NODE', node: dataEvent, observer: TreeNodeAddResultService })
		}, 0)
	})

	const suscriptionTreeNodeDeleteService$ = TreeNodeDeleteService.getSubject().subscribe((dataEvent: any) => {
		setTimeout(() => {
			TreeNodeDeleteResultService.setSubject(dataEvent);
		}, 0)
	})

	useEffect(() => {
		return () => {
			subscription$.unsubscribe()
			suscriptionTreeNodeDeleteService$.unsubscribe()
		}
	}, [])

	const onChangeRecibedF = (retorno: any) => {
		console.log('LLEGO FUNCION DE RETORNO PRINCIPAL', retorno)
		return onChange(retorno)
	}
	return (
		<div>
			<ul className="wtree">
				<TreeNode data={data} onChange={onChangeRecibedF} onChangeForDelete={onChangeRecibedF} render={render} />
			</ul>
		</div>
	)
}

export default Tree



