const data = [
    {
      id: 1,
      label: "Nodo 1",
      children: [
        {
          id: 2,
          label: "Nodo 1.1"
        },
        {
          id: 3,
          label: "Nodo 1.2"
        },
      ],
    },
    {
      id: 4,
      label: "Nodo 2",
    },
  ];
  
  function ComponenteArbol({ data, render }:any) {
    return (
      <ul>
        {data.map((nodo:any) => (
          <li key={nodo.id}>
            {render(nodo)}
            {nodo.children && (
              <ComponenteArbol data={nodo.children} render={render} />
            )}
          </li>
        ))}
      </ul>
    );
  }
  
  function ComponentePadre() {
    const render = (nodo:any) => {
      // devolver el componente que quieres mostrar para cada nodo
      // puedes usar diferentes componentes según las propiedades del nodo
      return <div>{nodo.label}</div>;
    };
    
    return <ComponenteArbol data={data} render={render} />;
  }