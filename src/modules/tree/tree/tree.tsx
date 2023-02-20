import { Children, useState } from "react";
import {v4 as uuidv4} from 'uuid';
interface props
{	onChange:(data:any)=>void
	data:any
	contador:number
	parent?:any

}
  function Tree ({onChange,data, contador=0, parent}:props) {
	contador+=1
	const [datatree, setDataTree] = useState(data);

	const handleclik =()=>{
        if(datatree.hasOwnProperty('children') && datatree.children.length>=0){
			let dato1 ={id:uuidv4(), label:'nueva'+contador}
			datatree['children'].push(dato1)
			setDataTree({...datatree})
		
		} else {
			let dato1 ={id:uuidv4(), label:'nueva'+contador}
			datatree['children'] =[dato1]
			setDataTree({...datatree})
		}

		//setDataTree((prevstate:any)=>[...prevstate,dato])
		return onChange(datatree)
	}	

	const flechas ='o'+'-'.repeat(contador*2)+'-> ';

	const onChangeRecibed=(retorno:any)=>{
		console.log('PADRE', parent)
			console.log('LLEGO FUNCION DE RETORNO', retorno)
			console.log('LLEGO FUNCION data', data)
			console.log('LLEGO FUNCION stado actual', datatree)
		
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
				parent={datatree}
				/>
				)
			})}

			</div>
		
		</>
	);
};

export default Tree;