import { useEffect, useState } from "react";
import { Subscriber } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { TreeNodeAddResultService } from "./tree-node-add-result-service";
import { TreeNodeAddService } from "./tree-node-add-service";
import { TreeNodeDeleteResultService } from "./tree-node-delete-result-service";
import { TreeNodeDeleteService } from "./tree-node-delete-service copy";
import "./tree-style.css";
interface props {
  onChange: (data: any) => void
  onChangeForDelete: (data: any) => void
  data: any
}

function TreeNode({ onChange, onChangeForDelete: onChangeForDeleteNode, data }: props) {

  const [datatree, setDataTree] = useState(data);
  let suscriberResultAdd$: any

  const handleClikAddNode = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const newNode = createNewNode(datatree.level + 1, datatree.children.length + 1)

    TreeNodeAddService.setSubject(newNode);

    suscriberResultAdd$ = TreeNodeAddResultService.getSubject().subscribe(() => {
      datatree['children'].push(newNode)
      datatree.hasChildren = true
      const lengthArray =datatree['children'].length 
      let resultmap =datatree['children'].map((item:any,index:number)=>{
     
        let arrayOfStrings:string[] = datatree.routeDrawBranch.split(',')
        arrayOfStrings.pop()
        arrayOfStrings.push("0")
  
     
        if(index===0 && lengthArray===1){
          arrayOfStrings.push("1")
          item.routeDrawBranch=arrayOfStrings.toString();
        }

        if(index===0 && lengthArray >1){
          arrayOfStrings.push("2")
          item.routeDrawBranch=arrayOfStrings.toString();
        }

 

        if(index >0 &&  index < lengthArray -1){
          arrayOfStrings.push("3")
          item.routeDrawBranch=arrayOfStrings.toString();
        }

        if(index >0 && index=== lengthArray -1){
          arrayOfStrings.push("1")
          item.routeDrawBranch=arrayOfStrings.toString();
        }
        return item
      })

      console.log('datatree[children]',datatree['children'],'INITIAL')
      
      datatree['children'] =resultmap

      console.log('datatree[children]',datatree['children'],'resultmap',resultmap)

      setDataTree({ ...datatree })
      if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() }
    })
    
  }

  const createNewNode = (nivel: number, orden: number) => {

    return { id: uuidv4(), label: 'nueva ' + nivel + '.' + orden, parentId: datatree.id, isOpen: true, level: nivel, routeDrawBranch:"" }
  }

  const handleClikDeleteNode = () => {
    onChangeForDeleteNode(datatree.id)
  }

  const handleclikChangeOpen = () => {
    setDataTree({ ...datatree, isOpen: !datatree['isOpen'] })
  }

  let suscriberTreeNodeDeleteResultService$: any
  const onChangeForDeleteRecibed = (retorno: any) => {

    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {
      TreeNodeDeleteService.setSubject(retorno)
      suscriberTreeNodeDeleteResultService$ = TreeNodeDeleteResultService.getSubject().subscribe(() => {

        datatree['children'] = datatree['children'].filter((item: any) => item.id != retorno)
        if (datatree['children'].length === 0) {
          datatree.hasChildren = false
        }
        setDataTree({ ...datatree })

        if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe() }

      })

    }
  }

  const onChangeRecibed = (retorno: any) => { return onChange(retorno) }


  let seasonsList:any = [];
  const arrayOfStrings:[] = datatree.routeDrawBranch.split(',')
console.log('arrayOfStrings',arrayOfStrings,datatree.routeDrawBranch )
  arrayOfStrings.map((item)=>{

    if( item ==='0'){
      seasonsList.push(<div className="ux-empty-0" key={uuidv4()}></div>);
    }

    if( item ==='1'){
      seasonsList.push(<div className="ux-empty-1" key={uuidv4()}></div>);
    }

    if( item ==='2'){
      seasonsList.push(<div className="ux-empty-2" key={uuidv4()}></div>);
    }

    if( item ==='3'){
      seasonsList.push(<div className="ux-empty-3" key={uuidv4()}></div>);
    }

  }) 

  let classnameTree ='ux-li'
  let classnameTreeChild ='ux-ul'

  // if(datatree.level === 0){
  //   classnameTree ='ux-ul'
  // }
  
  
  useEffect(() => {
    return () => {
      if (suscriberResultAdd$ instanceof Subscriber) { suscriberResultAdd$.unsubscribe() }
      if (suscriberTreeNodeDeleteResultService$ instanceof Subscriber) { suscriberTreeNodeDeleteResultService$.unsubscribe() }
    }
  }, [])

  return (
    <li className={classnameTree} key={datatree.id}>
      <div className="ux-container-row">
      {/* {seasonsList} */}
      <div className="ux-contend">
        <div className="ux-control">
          {datatree.hasChildren && <button className="ux-button" onClick={() => handleclikChangeOpen()} >+</button>}
          {!datatree.hasChildren && <div className="ux-item-control" ></div>}
        </div>
        <div className="ux-item-contend">{datatree.label}</div>
        <div className="ux-control">
          <button className="ux-button" onClick={() => handleClikAddNode()} >ADD</button>
          <button className="ux-button" onClick={() => handleClikDeleteNode()} >DEL</button>
        </div>
      </div>
      </div>

      {datatree.hasChildren && <ul className={classnameTreeChild}>
        {datatree.isOpen && datatree.hasChildren && datatree.children.map((child: any) => {
          return (
            <TreeNode
              key={child.id.toString()}
              data={child}
              onChangeForDelete={onChangeForDeleteRecibed}
              onChange={onChangeRecibed}
            />
          )
        })}
      </ul>}

    </li> 
  );
};

export default TreeNode;