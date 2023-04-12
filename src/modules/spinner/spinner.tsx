import './spinner.scss'
function Spinner({message ='Procesando ...'}) {
  return (
<div  className="loader-content">
  <div className="ui-loader">
    <div className="animationStripes"> </div>
    <span className ="ui-loader-message"> {message}</span>
  </div>
</div>
  )
};

export default Spinner