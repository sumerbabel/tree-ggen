import { useEffect } from "react";
import TreeNode from "./tree-node";
import "./tree-style.scss";
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";

export interface propsTree<T> {
	onChange: (treeEventData: TreeDataEvent<T>, subject:TreeSubject<TreeDataEvent<T>>) => void
	data: TreeDataModel<T>
	render?: (renderProps: RenderTree<T>) => JSX.Element
}

function Tree<T>({ onChange, data, render }: propsTree<T>) {
	const treeNodeService = new TreeSubject<TreeDataEvent<T>>()
	const subscription$ = treeNodeService.subscribe((treeData: TreeDataEvent<T>) => {
		if (treeData.event === TreeKeyEvent.Create || treeData.event === TreeKeyEvent.Delete || treeData.event === TreeKeyEvent.Update || treeData.event === TreeKeyEvent.Read) {
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