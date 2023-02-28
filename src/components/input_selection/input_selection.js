import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { InputSelector, InputSelectorComp } from "./input_selector";
import { Observable, ObservableEditor } from "./observable_editor";
import { Observer, ObserverEditor } from "./observer_editor";


function InputSelection( { selected } ) {
  const [observables, changeObservables] = useState([])
  const [observers, changeObservers] = useState([])

  // TODO: less duplication?
  function addObservable() {
    const newObservables = [...observables];
    newObservables.push(new Observable());
    changeObservables(newObservables);
  }

  function removeObservable(observable) {
    const index = observables.indexOf(observable);
    if (index > -1) {
      const newObservables = [...observables];
      newObservables.splice(index, 1);
      changeObservables(newObservables);
    }
  }

  function addObserver() {
    const newObservers = [...observers];
    newObservers.push(new Observer());
    changeObservers(newObservers);
  }

  function removeObserver(observer) {
    const index = observers.indexOf(observer);
    if (index > -1) {
      const newObservers = [...observers];
      newObservers.splice(index, 1);
      changeObservers(newObservers);
    }
  }
  console.log(selected)


  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
      {selected ? (
        <>
          <VerticalColumn colour='lightgray' Component={ObservableEditor} elementArray={observables} addElementFunction={addObservable} removeElementFunction={removeObservable} />
          <VerticalColumn colour='gray' Component={ObserverEditor} elementArray={observers} addElementFunction={addObserver} removeElementFunction={removeObserver}/>
        </>
      ) : null}      
      <VerticalColumn colour='lightgray' Component={ObserverEditor} elementArray={[]}/>
    </div>
  );
}


function VerticalColumn ({ colour, Component, elementArray, addElementFunction, removeElementFunction }) {
  console.log(elementArray)

  return (
    <div style={{ flex: 1, background: colour, height: "100%", padding: '5px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={addElementFunction} style={{marginBottom: '20px'}}>+</button>
      {elementArray.map((element) => (
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <Component element={element} ></Component> 
            <button onClick={() => removeElementFunction(element)}>-</button>
          </div>
          ))}
    </div>
  )
}



export default InputSelection;
