import { Children, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import { treeService } from "./tree-service";
interface props
{	onChange:(data:any)=>void
	data:any
	contador:number
}
  function Tree ({onChange,data, contador=0}:props) {
	contador+=1
	
	const [datatree, setDataTree] = useState(data);
	console.log(datatree.label)
	
	const handleclik =()=>{
		const subscription$ = treeService.getSubject();
        if(datatree.hasOwnProperty('children') && datatree.children.length>=0){
			
			const orden =datatree.children.length +1
			const newNode ={id:uuidv4(), label:'nueva '+(contador+1)+'.'+orden, parentId:datatree.id}

			treeService.setSubject({action:'add', data :newNode});

			const suscriber$ = subscription$.subscribe((data:any)=>{
                  console.log('data suscribe 1',data)
				if(data['action'] =='add-ok' && data['data'].id ==newNode.id){
					datatree['children'].push(newNode)
					setDataTree({...datatree})
					suscriber$.unsubscribe() 
				}
			}) 

			
			//return onChange({action:'add', data :newNode})
		} else {
			const orden =1
			const newNode ={id:uuidv4(), label:'nueva '+(contador+1)+'.'+orden, parentId:datatree.id}

			treeService.setSubject({action:'add', data :newNode});

			const suscriber$ = subscription$.subscribe((data:any)=>{
                  console.log('data suscribe 2',data)
				if(data['action'] =='add-ok' && data['data'].id ==newNode.id){
					datatree['children'] =[newNode]
					setDataTree({...datatree})
					suscriber$.unsubscribe() 
				}
			}) 


			// datatree['children'] =[newNode]
			// setDataTree({...datatree})
			//return onChange({action:'add', data :newNode})
		}
		
	}	

	const flechas ='o'+'-'.repeat(contador*2)+'-> ';

	const onChangeRecibed=(retorno:any)=>{
			//return onChange(retorno)
	}

	return (
		<>
			<div style={{ "backgroundColor": 'gray'}} key={datatree.id.toString()}>
			<span style={{ "backgroundColor": 'blue', color:"white", maxHeight:"30px", fontWeight:700}}>{flechas}{contador}</span>	
			<button style={{ "backgroundColor": 'blue', color:"white", maxHeight:"30px"}} onClick={() => handleclik()} >ADD</button>
			{contador} -{datatree.label}
			{datatree.children && datatree.children.map((child: any) => { 
				return(
				<Tree
				key={child.id.toString()}
				data={child}
				contador={contador}
				onChange={onChangeRecibed}
				/>
				)
			})}
			</div>
		</>
	);
};

export default Tree;