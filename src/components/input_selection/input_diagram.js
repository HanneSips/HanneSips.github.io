import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import * as go from 'gojs';


function InputDiagram({ observables, observers, parameters, firedObservables, changeActiveEditor }) {
  const diagramRef = useRef(null);
  const [nodeDataArray, changeNodeDataArray] = useState([])
  const [linkDataArray, changeLinkArray] = useState([]);
  const diagram = useRef();
  const model = useRef();
  const $ = useRef();
  const prevObservables = useRef([])
  const prevObservers = useRef([])
  const prevParameters = useRef([])
  const prevEmittedValuesArray = useRef([])
  const prevParameterValues = useRef([])


  // ON FIRST RENDER
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
    createNodeTemplate("observer_highlight", 2, "#00AA00")
    createNodeTemplate("parameter", 2, "#FFFFFF")
    createNodeTemplate("parameter_highlight", 2, "#FF00FF")
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
            click: nodeClickFunction
          },
          $.current(go.TextBlock, "Editor")),
      ))
    diagram.current.nodeTemplateMap.add(name, nodeTemplate)
  }

  function nodeClickFunction(e, obj) {
    var node = obj.part;
    var data = node.data;
    changeActiveEditor(data.name)
  }

  // ON OBSERVABLE EMITION
  useEffect(() => {
    console.log("observable emitted value effect")
    // highlight observable / observer / parameter flows that fired
    // for i = 1 to length of emittedValues:
    // if prev /= new ==> highlight (observables[i])
    const newEmittedValuesArray = observables.map(observable => {
      return observable.emittedValues
    });
    const newParameterValues = parameters.map(param => {
      return param.value
    });

    var toHighlight = []
    for (let i = 0; i <= prevEmittedValuesArray.current.length; i++) {
      if (prevEmittedValuesArray.current[i] !== newEmittedValuesArray[i]) {
        toHighlight.push(observables[i])
      }
    }

    for (let i = 0; i <= prevParameterValues.current.length; i++) {
      if (prevParameterValues.current[i] !== newParameterValues[i]) {
        toHighlight.push(parameters[i])
      }
    }

    highlightElementNodes(toHighlight)


    prevEmittedValuesArray.current = newEmittedValuesArray
    prevParameterValues.current = newParameterValues


  }, [firedObservables])

  function highlightElementNodes(elements) {
    var tempNodeDataArray = nodeDataArray
    elements.forEach(element => {
      element.changeCategory(element.coreCategory + "_highlight")
      tempNodeDataArray = calculateNewNodeDataArray(tempNodeDataArray, element)
      changeNodeDataArray(tempNodeDataArray)
    })
    setTimeout(() => {
      elements.forEach(element => {
        element.changeCategory(element.coreCategory)
        tempNodeDataArray = calculateNewNodeDataArray(tempNodeDataArray, element)
        changeNodeDataArray(tempNodeDataArray)
      })
    }, 500)
  }

  // ON ELEMENT ADDITION / REMOVAL
  useEffect(() => {
    // check new observables? Compare observables and prevObservables
    const newObservables = observables.filter(element => !prevObservables.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    newObservables.forEach((observable) => createNewNode(observable))

    // check removed observables? 
    const removedObservables = prevObservables.current.filter(element => !observables.includes(element));
    // If yes ==> remove node

    prevObservables.current = observables
    // update observable emittedvalues array
    prevEmittedValuesArray.current = observables.map(observable => {
      return observable.emittedValues
    });
  }, [observables])

  useEffect(() => {
    console.log("observers new effect")

    // check new observers? Compare observers and prevObservers
    const newObservers = observers.filter(element => !prevObservers.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    console.log(newObservers)
    newObservers.forEach((observer) => createNewNode(observer))

    // check removed observables? 
    const removedObservers = prevObservers.current.filter(element => !observers.includes(element));
    // If yes ==> remove node

    prevObservers.current = observers
    // update observable emittedvalues array
    prevEmittedValuesArray.current = observers.map(observer => {
      return observer.emittedValues
    });
  }, [observers])

  useEffect(() => {
    console.log("params new effect")

    // check new observers? Compare observers and prevObservers
    const newParams = parameters.filter(element => !prevParameters.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    console.log(newParams)
    newParams.forEach((parameter) => createNewNode(parameter))

    // check removed observables? 
    const removedParams = prevParameters.current.filter(element => !parameters.includes(element));
    // If yes ==> remove node

    prevParameters.current = parameters
    /*     // update observable emittedvalues array
        prevEmittedValuesArray.current = observers.map(observer => {
          return observer.emittedValues
        }); */
  }, [parameters])

  function createNewNode(element) {
    const node = constructNode(element);
    const newNodeDataArray = [...nodeDataArray, node];
    changeNodeDataArray(newNodeDataArray);
    changeActiveEditor(element.name)
  }

  function checkNewElement(previousArray, newArray) {
    return []
  }

  function checkRemovedElement(previousArray, newArray) {
    return []
  }

  // ON MODEL CHANGE ==> DIAGRAM SHOULD CHANGE
  useEffect(() => {
    // update the diagram model when nodeDataArray or linkDataArray change
    model.current.nodeDataArray = nodeDataArray
    model.current.linkDataArray = linkDataArray
    diagram.current.model = model.current
  }, [nodeDataArray, linkDataArray])

  function constructNode(element) {
    return { name: element.name, category: element.category, element: element, color: element.color }
  }

  function calculateNewNodeDataArray(prevNodeDataArray, element) {
    const elementNodeIndex = prevNodeDataArray.findIndex(node => node.name === element.name);
    const newNode = constructNode(element)
    if (elementNodeIndex !== -1) {
      const newNodeDataArray = [...prevNodeDataArray]
      newNodeDataArray[elementNodeIndex] = newNode;
      return newNodeDataArray
    }
  }

  return <div ref={diagramRef} style={{ position: 'relative', top: 0, left: 0, zIndex: 1, height: "100%", width: "100%" }}>
  </div>
}


export default InputDiagram 