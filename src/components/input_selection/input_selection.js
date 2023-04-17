import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import { Obsvable, ObservableEditor } from "./observable_editor";
import Editor from "./editor";
import InputDiagram from "./input_diagram"
import { Observer, ObserverEditor } from "./observer_editor";
import { VisualParameter, VisualParameterComp } from "./visual_parameters";
import * as go from 'gojs';
import { Controlled } from "react-codemirror2";
import { ReactDiagram } from "gojs-react";


function InputSelection({
  selected, observables, observers, parameters, changeParameters,
  changeObservables, changeObservers, executeCode, firedObservables }) {
  console.log("render input")

  function handleRunClick() {
    executeCode()
  }

  function removeElement(elementArray, element, changeElementArrayState) {
    const index = elementArray.indexOf(element);
    if (index > -1) {
      const newelementArray = [...elementArray];
      newelementArray.splice(index, 1);
      changeElementArrayState(newelementArray);
    }
  }

  function addElement(elementArray, newElement, changeElementArrayState) {
    const newElementArray = [...elementArray];
    newElementArray.push(newElement);
    changeElementArrayState(newElementArray);
  }

  const [editorHeight, setEditorHeight] = useState("50%");

  return (
    <div style={{ position: 'relative', width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "50%" }}>
        <button onClick={handleRunClick} style={{ width: "100%" }}>RUN</button>
        <button onClick={() => (addElement(observables, new Obsvable(observables.length), changeObservables))} style={{ width: "33%" }}>+ OBSERVABLE</button>
        <button onClick={() => (addElement(observers, new Observer(observers.length), changeObservers))} style={{ width: "33%" }}>+ OBSERVER</button>
        <button onClick={() => (addElement(parameters, new VisualParameter(parameters.length), changeParameters))} style={{ width: "33%" }}>+ PARAMETER</button>
        <InputDiagram
          observables={observables}
          observers={observers}
          parameters={parameters}
          firedObservables={firedObservables}
        />
      </div>
      <Editor
        className="editor"
        observables={observables}
        observers={observers}
        parameters={parameters}
        state={firedObservables}
      />
    </div>
  );
}



function VerticalColumn({ name, colour, Component, elementArray, addElementFunction, removeElementFunction,
  highlightNodeFunction, state }) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  return (
    <div style={{
      flex: 1, background: colour, height: "100%", padding: '5px',
      display: 'flex', flexDirection: 'column', maxWidth: '100%',
      border: '1px solid rgba(0, 0, 0, 0.20)', position: 'relative'
    }}>
      {isOverlayVisible && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }} />}
      <h5>{name}</h5>
      <button onClick={addElementFunction} style={{ marginBottom: '20px' }}>+</button>
      {elementArray.map((element) => {
        return <div style={{ overflow: 'auto', flex: 1, display: 'flex', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', width: "95%" }}>
          <Component element={element} state={state} highlightNodeFunction={highlightNodeFunction} />
          {/* <button onClick={() => removeElementFunction(element)}>-</button> */}
        </div>
      })}
    </div>
  )
}



export default InputSelection;
