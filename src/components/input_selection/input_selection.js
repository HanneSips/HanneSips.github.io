import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import { Obsvable, ObservableEditor } from "./observable_editor";
import { Observer, ObserverEditor } from "./observer_editor";
import { VisualParameter, VisualParameterComp } from "./visual_parameters";


function InputSelection( { 
  selected, observables, observers, parameters, changeParameters,
  addElementFunction, removeElementFunction, 
  changeObservables, changeObservers, executeCode, state } ) {
        //create your forceUpdate hook

        function handleRunClick() {
          executeCode()
        }

        return (
          <div>
            <button onClick={handleRunClick} style={{width: "100%"}}>RUN</button>
            <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                {selected ? (
                  <>
                    <VerticalColumn colour='lightgray' Component={ObservableEditor} elementArray={observables} 
                      addElementFunction={() => (addElementFunction(observables, new Obsvable(observables.length), changeObservables))} 
                      removeElementFunction={(element) => (removeElementFunction(observables, element, changeObservables))}
                      style={{width: "30%"}}/>
                    <VerticalColumn colour='gray' Component={ObserverEditor} elementArray={observers} 
                      addElementFunction={() => (addElementFunction(observers, new Observer(observers.length), changeObservers))} 
                      removeElementFunction={(element) => (removeElementFunction(observers, element, changeObservers))}
                      style={{width: "30%"}}/>
                  </>
                ) : null}      
                <VerticalColumn colour='lightgray' Component={VisualParameterComp} elementArray={parameters} 
                  addElementFunction={() => (addElementFunction(parameters, new VisualParameter(parameters.length), changeParameters))} 
                  removeElementFunction={(element) => (removeElementFunction(parameters, element, changeParameters))}
                  state={state}
                  style={{width: "20%"}}
                  />
              </div>
          </div>
        );
}


function VerticalColumn ({ colour, Component, elementArray, addElementFunction, removeElementFunction, state }) {
  return (
    <div style={{ flex: 1, background: colour, height: "100%", padding: '5px', display: 'flex', flexDirection: 'column', maxWidth: '100%'}}>
      <button onClick={addElementFunction} style={{marginBottom: '20px'}}>+</button>
      {elementArray.map((element) => (
          <div style={{ overflow: 'auto', flex: 1, display: 'flex', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', width: "95%" }}>
            <Component element={element} state={state}></Component> 
            <button onClick={() => removeElementFunction(element)}>-</button>
          </div>
          ))}
    </div>
  )
}

export default InputSelection;
