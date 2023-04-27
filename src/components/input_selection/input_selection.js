import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import { Obsvable } from "./observable";
import { Editors } from "./editors";
import InputDiagram from "./input_diagram"
import { Observer } from "./observer";
import { VisualParameter, VisualParameterComp } from "./visual_parameters";
import * as go from 'gojs';
import { Controlled } from "react-codemirror2";
import { ReactDiagram } from "gojs-react";
import prebuildObservables from "./prebuild_observables/midiDeviceObservable";


function InputSelection({
  selected, observables, observers, parameters, changeParameters,
  changeObservables, changeObservers, executeCode, firedObservables, run }) {
  console.log("render input")
  const [activeEditor, changeActiveEditor] = useState()
  const [showPrebuiltObservables, setShowPrebuiltObservables] = useState(false);
  const [renamedElement, renameElement] = useState()


  function handleRunClick() {
    executeCode()
  }

  function handleBrowseObservablesClick() {
    setShowPrebuiltObservables(true);
  }

  function handlePrebuiltObservableClick(observable) {
    addElement(observables, observable, changeObservables);
    setShowPrebuiltObservables(false);
  }

  function addElement(elementArray, newElement, changeElementArrayState) {
    const newElementArray = [...elementArray];
    newElementArray.push(newElement);
    changeElementArrayState(newElementArray);
  }

  return (
    <div style={{ position: 'relative', width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "50%" }}>
        <button onClick={handleRunClick} style={{ width: "100%" }}>RUN</button>
        <button onClick={() => (addElement(observables, new Obsvable(observables.length), changeObservables))} style={{ width: "33%" }}>+ OBSERVABLE</button>
        <button onClick={() => (addElement(observers, new Observer(observers.length), changeObservers))} style={{ width: "33%" }}>+ OBSERVER</button>
        <button onClick={() => (addElement(parameters, new VisualParameter(parameters.length), changeParameters))} style={{ width: "33%" }}>+ PARAMETER</button>
        <button onClick={() => (setShowPrebuiltObservables(true))} style={{ width: "33%" }}>Browse...</button>
        <InputDiagram
          observables={observables}
          observers={observers}
          parameters={parameters}
          changeObservables={changeObservables}
          changeObservers={changeObservers}
          changeParameters={changeParameters}
          firedObservables={firedObservables}
          changeActiveEditor={changeActiveEditor}
          activeEditor={activeEditor}
          run={run}
          renamedElement={renamedElement}
        />
      </div>
      <Editors
        className="editor"
        observables={observables}
        observers={observers}
        parameters={parameters}
        state={firedObservables}
        activeEditor={activeEditor}
        renameElement={renameElement}
      />
      {showPrebuiltObservables && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }}>
          <div style={{ position: "absolute", top: "50%", left: "25%", transform: "translate(-50%, -50%)", backgroundColor: "white", borderRadius: 10, padding: 20 }}>
            <h2>Prebuilt Observables</h2>
            <ul style={{ maxHeight: 200, overflowY: "auto", width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
              {prebuildObservables.slice(0, 5).map((observable) => (
                <li key={observable.id} onClick={() => handlePrebuiltObservableClick(observable)}>
                  <button style={{ width: "100%" }}>{observable.name}</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowPrebuiltObservables(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


export default InputSelection;
