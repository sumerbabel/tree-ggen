import { useEffect } from "react";
import TreeNode from "./tree-node";
import "./tree-style.scss";
import { TreeData, TreeEvent, TreeEventData } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";

interface props {
	onChange: (treeEventData: TreeEventData<TreeData>) => void
	data: any
	render?: (data: any) => JSX.Element
}
function Tree({ onChange, data, render }: props) {

	const treeNodeService: TreeSubject<TreeData> = new TreeSubject<TreeData>()
	const subscription$ = treeNodeService.subscribe((treeData: TreeData) => {
		if (treeData.event === TreeEvent.Create || treeData.event === TreeEvent.Delete || treeData.event === TreeEvent.Update || treeData.event === TreeEvent.Read) {
			onChange({ treeData: treeData, subject: treeNodeService })
		}
	})

	useEffect(() => { return () => { subscription$() } }, [])

	return (
		<div>
			<ul className="wtree">
				<TreeNode data={data} render={render} treeNodeService={treeNodeService} />
			</ul>
		</div>
	)
}

export default Tree



