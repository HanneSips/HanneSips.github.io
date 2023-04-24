import { ObservableEditor } from "./observable_editor"

function Editor({ observables, observers, parameters, state, activeEditor }) {
  function calculateZIndex(elementName) {
    if (activeEditor === elementName) {
      return 1
    } else return 0
  }
  return (
    <div style={{ position: 'relative', height: '50%', width: '100%' }}>
      {observables.map((element, index) => (
        <div id={element.name} className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: calculateZIndex(element.name) }}>
          <ObservableEditor element={element} state={state} />
          {/* <button onClick={() => removeElementFunction(element)}>-</button> */}
        </div>
      ))}
      {observers.map((element, index) => (
        <div id={element.name} className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: calculateZIndex(element.name) }}>
          <ObservableEditor element={element} state={state} />
        </div>
      ))}
    </div>
  );
}


export default Editor