import { useEffect } from "react";
import TreeNode from "./tree-node";
import "./tree-style.scss";
import { TreeData, TreeDataModel, TreeEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";

interface props<T> {
	onChange: (treeEventData: TreeData<T>, subject:TreeSubject<TreeData<T>>) => void
	data: TreeDataModel<T>
	render?: (data: any) => JSX.Element
}

function Tree<T>({ onChange, data, render }: props<T>) {
	const treeNodeService = new TreeSubject<TreeData<T>>()
	const subscription$ = treeNodeService.subscribe((treeData: TreeData<T>) => {
		if (treeData.event === TreeEvent.Create || treeData.event === TreeEvent.Delete || treeData.event === TreeEvent.Update || treeData.event === TreeEvent.Read) {
			onChange( treeData,
				treeNodeService 
			)
		}
	})

	useEffect(() => { return () => { subscription$() } }, [])

	return (
		<ul className="wtree">
			<TreeNode <T> data={data} render={render} treeNodeService={treeNodeService} initialClassName={"no-first"} />
		</ul>
	)
}

export default Tree