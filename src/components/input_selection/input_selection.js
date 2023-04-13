import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import { Obsvable, ObservableEditor } from "./observable_editor";
import { Observer, ObserverEditor } from "./observer_editor";
import { VisualParameter, VisualParameterComp } from "./visual_parameters";
import * as go from 'gojs';
import { Controlled } from "react-codemirror2";
import { ReactDiagram } from "gojs-react";


function InputSelection({
  selected, observables, observers, parameters, changeParameters,
  changeObservables, changeObservers, executeCode, state }) {
  console.log("render input")
  const diagramRef = useRef(null);
  const [nodeDataArray, changeNodeDataArray] = useState([])
  const [linkDataArray, changeLinkArray] = useState([]);
  const diagram = useRef();
  const model = useRef();
  const $ = useRef();

  function handleRunClick() {
    executeCode()
  }

  useEffect(() => {
    model.current = new go.GraphLinksModel();
    diagram.current = new go.Diagram();
    $.current = go.GraphObject.make
    // define a grid layout with 3 columns
    diagram.current.layout = $.current(go.GridLayout, {
      wrappingColumn: 3,
      cellSize: new go.Size(1, 1),
    });
    diagram.current.div = diagramRef.current;

    createNodeTemplate("observable", 0, "#FFFFFF")
    createNodeTemplate("observable_highlight", 0, "#FFFF00")
    createNodeTemplate("observer", 1, "#FFFFFF")
    createNodeTemplate("parameter", 2, "#FFFFFF")
  }, [])

  function createNodeTemplate(name, column, colour) {
    const nodeTemplate = $.current(go.Node,
      "Vertical",
      { background: colour, column: column },
      $.current(go.TextBlock,
        new go.Binding("text", "name")),
      $.current(go.Panel, "Horizontal",
        { stretch: go.GraphObject.Horizontal },
        $.current("Button",
          new go.Binding("element", "element"),
          {
            margin: 2,
            click: showElement
          },
          $.current(go.TextBlock, "Click me!")),
      ))
    diagram.current.nodeTemplateMap.add(name, nodeTemplate)
  }

  function showElement(e, obj) {
    var node = obj.part;
    var data = node.data;
  }

  useEffect(() => {
    // update the diagram model when nodeDataArray or linkDataArray change
    model.current.nodeDataArray = nodeDataArray
    model.current.linkDataArray = linkDataArray
    diagram.current.model = model.current
  }, [nodeDataArray, linkDataArray])


  function removeElement(elementArray, element, changeElementArrayState) {
    const index = elementArray.indexOf(element);
    if (index > -1) {
      const newelementArray = [...elementArray];
      newelementArray.splice(index, 1);
      changeElementArrayState(newelementArray);
    }
  }

  function addElement(elementArray, newElement, changeElementArrayState) {
    createNewNode(newElement)
    const newElementArray = [...elementArray];
    newElementArray.push(newElement);
    changeElementArrayState(newElementArray);
  }

  function highlightElementNode(element) {
    console.log("highlight")
    element.changeCategory(element.coreCategory + "_highlight")
    updateElementNode(element)
    setTimeout(() => {
      element.changeCategory(element.coreCategory)
      updateElementNode(element)
    }, 500);
  }

  function constructNode(element) {
    return { name: element.name, category: element.category, element: element, color: element.color }
  }

  function updateElementNode(element) {
    const elementNodeIndex = nodeDataArray.findIndex(node => node.name === element.name);
    const newNode = constructNode(element)
    if (elementNodeIndex !== -1) {
      const newNodeDataArray = [...nodeDataArray]
      newNodeDataArray[elementNodeIndex] = newNode;
      changeNodeDataArray(newNodeDataArray)
    }
  }

  function createNewNode(element) {
    const node = constructNode(element);
    const newNodeDataArray = [...nodeDataArray, node];
    changeNodeDataArray(newNodeDataArray);
  }

  const [editorHeight, setEditorHeight] = useState("50%");

  return (
    <div style={{ position: 'relative', width: "100%", height: "100%" }}>
      <button onClick={handleRunClick} style={{ width: "100%" }}>RUN</button>
      <button onClick={() => (addElement(observables, new Obsvable(observables.length), changeObservables))} style={{ width: "33%" }}>+ OBSERVABLE</button>
      <button onClick={() => (addElement(observers, new Observer(observers.length), changeObservers))} style={{ width: "33%" }}>+ OBSERVER</button>
      <button onClick={() => (addElement(parameters, new VisualParameter(parameters.length), changeParameters))} style={{ width: "33%" }}>+ PARAMETER</button>

      <div ref={diagramRef} style={{ position: 'relative', top: 0, left: 0, zIndex: 1, height: "50%", width: "100%" }}>
        {/* Diagram content */}
      </div>
      <div style={{ position: 'relative', top: 0, left: 0, zIndex: 1, height: editorHeight, width: "100%" }}>

      </div>
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
