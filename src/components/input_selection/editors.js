import Editor from "./editor";

function Editors({ observables, observers, parameters, state, activeEditor, renameElement }) {
  function calculateZIndex(elementId) {
    if (activeEditor === elementId) {
      return 1
    } else return 0
  }

  return (
    <div style={{ position: 'relative', height: '50%', width: '100%' }}>
      {observables.map((element, index) => (
        <div id={element.id} className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: calculateZIndex(element.id) }}>
          <Editor element={element} state={state} renameElement={renameElement} />
          {/* <button onClick={() => removeElementFunction(element)}>-</button> */}
        </div>
      ))}
      {observers.map((element, index) => (
        <div id={element.id} className="Observ" key={element.id} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: calculateZIndex(element.id) }}>
          <Editor element={element} state={state} renameElement={renameElement} />
        </div>
      ))}
    </div>
  );
}


export { Editors }