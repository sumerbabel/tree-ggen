import { useEffect } from "react";
import TreeNode from "./tree-node";
import "./tree-style.scss";
import { SubjectManager } from "../../core/utilities/subject-manager";
import { TreeData } from "./tree.data.interface";

interface props {
	onChange: (data: any) => void
	data: any
	render?: (data: any) => JSX.Element
}
function Tree({ onChange, data, render }: props) {
	const treeNodeService:SubjectManager<TreeData> = new SubjectManager<TreeData>()

	const subscription$ = treeNodeService.getSubject().subscribe((dataEvent: any) => {
		setTimeout(() => {
			//TreeNodeAddResultService.setSubject(dataEvent);
			onChange({ dataEvent, observer: treeNodeService })
		}, 0)
	})

	const suscriptionTreeNodeDeleteService$ = treeNodeService.getSubject().subscribe((dataEvent: any) => {
		setTimeout(() => {
			//treeNodeDeleteResultService.setSubject(dataEvent);
			onChange({ dataEvent, observer: treeNodeService })
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
				<TreeNode data={data} onChange={onChangeRecibedF} onChangeForDelete={onChangeRecibedF} render={render} treeNodeService={treeNodeService}/>
			</ul>
		</div>
	)
}

export default Tree



