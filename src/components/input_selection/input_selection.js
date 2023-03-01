import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Obsvable, ObservableEditor } from "./observable_editor";
import { Observer, ObserverEditor } from "./observer_editor";


function InputSelection( { selected, observables, observers, addElementFunction, removeElementFunction, changeObservables, changeObservers, executeCode } ) {
  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
      {selected ? (
        <>
          <VerticalColumn colour='lightgray' Component={ObservableEditor} elementArray={observables} 
            addElementFunction={() => (addElementFunction(observables, new Obsvable(), changeObservables))} 
            removeElementFunction={(element) => (removeElementFunction(observables, element, changeObservables))}
            executeCode={executeCode}
            />
          <VerticalColumn colour='gray' Component={ObserverEditor} elementArray={observers} 
            addElementFunction={() => (addElementFunction(observers, new Observer(), changeObservers))} 
            removeElementFunction={(element) => (removeElementFunction(observers, element, changeObservers))}
            executeCode={executeCode}
            />
        </>
      ) : null}      
      <VerticalColumn colour='lightgray' Component={ObserverEditor} elementArray={[]}/>
    </div>
  );
}


function VerticalColumn ({ colour, Component, elementArray, addElementFunction, removeElementFunction, executeCode }) {

  return (
    <div style={{ flex: 1, background: colour, height: "100%", padding: '5px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={addElementFunction} style={{marginBottom: '20px'}}>+</button>
      {elementArray.map((element) => (
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <Component element={element} ></Component> 
            <button onClick={() => removeElementFunction(element)}>-</button>
            <button onClick={executeCode}>RUN</button>
          </div>
          ))}
    </div>
  )
}

export default InputSelection;
