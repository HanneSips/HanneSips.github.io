import { ObservableEditor } from "./observable_editor"

function Editor({ observables, observers, parameters, state }) {

  return (
    <div style={{ position: 'relative', height: '50%', width: '100%' }}>
      {observables.map((element, index) => (
        <div className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: observables.length - index }}>
          <ObservableEditor element={element} state={state} />
          {/* <button onClick={() => removeElementFunction(element)}>-</button> */}
        </div>
      ))}
      {observers.map((element, index) => (
        <div className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: observers.length - index }}>
          <ObservableEditor element={element} state={state} />
          {/* <button onClick={() => removeElementFunction(element)}>-</button> */}
        </div>
      ))}
    </div>
  );
}


export default Editor