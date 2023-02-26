import { useEffect, useState } from "react";
import { Subscriber } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { treeService } from "./tree-service";

interface props {
  onChange: (data: any) => void
  onChangeForDelete: (data: any) => void
  data: any
}

function TreeNode({ onChange, onChangeForDelete, data }: props) {

  const [datatree, setDataTree] = useState(data);
  let suscriber$: any
  const handleclik = () => {
    if (!datatree.hasOwnProperty('children') && !Array.isArray(datatree['children'])) {
      datatree['children'] = []
    }
    const orden = datatree.children.length + 1
    const nivel = datatree.level + 1
    const newNode = { id: uuidv4(), label: 'nueva ' + nivel + '.' + orden, parentId: datatree.id, isOpen:true, level:nivel }
    treeService.setSubject({ action: 'add', data: newNode });

    suscriber$ = treeService.getSubject().subscribe((data: any) => {
      if (data['action'] == 'add-ok' && data['data'].id == newNode.id) {
        datatree['children'].push(newNode)
        setDataTree({ ...datatree })
        suscriber$.unsubscribe()
      }
    })
  }

  const handleclikDelete = () => {
    onChangeForDelete(datatree.id)
  }

  useEffect(() => { return () => { if (suscriber$ instanceof Subscriber) { suscriber$.unsubscribe() } } }, [])

 
  const handleclikChangeOpen = () => {
    setDataTree({ ...datatree, isOpen:!datatree['isOpen'] })
  }

  const flechas = 'o' + '-'.repeat(datatree.level * 3) + '-> ';


  const onChangeForDeleteRecibed = (retorno: any) => {
    if (datatree.hasOwnProperty('children') && Array.isArray(datatree['children'])) {

      datatree['children'] = datatree['children'].filter(item => item.id != retorno)
      setDataTree({ ...datatree })
    }
  }

  const onChangeRecibed = (retorno: any) => { return onChange(retorno) }

  return (
    <div style={{ "backgroundColor": 'gray' }}>
     {
      Array.isArray(datatree['children']) && datatree.children.length > 0 && <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleclikChangeOpen()} >+</button>
     }
      <span style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px", fontWeight: 700 }}>{flechas}{datatree.level}</span>
      <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleclik()} >ADD</button>
      <button style={{ "backgroundColor": 'blue', color: "white", maxHeight: "30px" }} onClick={() => handleclikDelete()} >DEL</button>
      {datatree.level} -{datatree.label} -- {String(datatree.isOpen)}
      {datatree.isOpen && datatree.children && datatree.children.map((child: any) => {
        return (
          <TreeNode
            key={child.id.toString()}
            data={child}
            onChangeForDelete={onChangeForDeleteRecibed}
            onChange={onChangeRecibed}
          />
        )
      })}
    </div>
  );
};

export default TreeNode;