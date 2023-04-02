import { useEffect } from "react";
import TreeNode from "./tree-node";
import "./tree-style.scss";
import { RenderTree, TreeDataEvent, TreeDataModel, TreeKeyEvent } from "./tree.data.interface";
import { TreeSubject } from "./tree.subject";

export interface propsTree<T = unknown> {
	onChange?: (treeEventData: TreeDataEvent<T>, subject: TreeSubject<TreeDataEvent<T>>) => void
	data: TreeDataModel<T>
	render?: (renderProps: RenderTree<T>) => JSX.Element
	arrayKeysEvents?:TreeKeyEvent[]
	subsititute_row_contend?:boolean
	confirmationChanges?:boolean
}

function Tree<T = unknown>({ onChange, data, render, subsititute_row_contend = true,arrayKeysEvents=[] ,confirmationChanges=false}: propsTree<T>) {
    
	
	const treeNodeService = new TreeSubject<TreeDataEvent<T>>()
	const subscription$ = treeNodeService.subscribe((treeData: TreeDataEvent<T>) => {
		if (treeData.event === TreeKeyEvent.Create || treeData.event === TreeKeyEvent.Delete || treeData.event === TreeKeyEvent.Update || treeData.event === TreeKeyEvent.Read) {
			if(onChange){onChange(treeData, treeNodeService)}
		}
	})

	useEffect(() => { return () => { subscription$() } }, [])

	return (
		<ul className="wtree">
			<TreeNode <T> data={data} render={render} treeNodeService={treeNodeService} initialClassName={"no-first"} subsititute_row_contend ={subsititute_row_contend} confirmationChanges={confirmationChanges}  arrayKeysEvents={arrayKeysEvents} />
		</ul>
	)
}

export default Tree