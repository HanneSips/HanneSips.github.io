import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import * as go from 'gojs';
import { Observer } from "./observer";
import { SELECTEDFILL, UNSELECTEDFILL, ERRORBORDER, NORMALBORDER, HIGHLIGHTBORDER } from "./layoutVars";


function InputDiagram({
  observables,
  observers,
  parameters,
  changeObservables,
  changeObservers,
  changeParameters,
  firedObservables,
  changeActiveEditor,
  activeEditor,
  run,
  upload,
  renamedElement
}) {
  const diagramRef = useRef(null);
  // Combine the three lists using spread operator
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
  const activeEditorRef = useRef(activeEditor)

  const observableColumn = useRef(0)
  const observerColumn = useRef(0)
  const parameterColumn = useRef(0)
  const observableRow = -100
  const observerRow = 100
  const parameterRow = 300

  // ON FIRST RENDER
  useEffect(() => {
    model.current = new go.GraphLinksModel();
    diagram.current = new go.Diagram();
    diagram.current.addDiagramListener("SelectionDeleted", e => {
      const removedNodes = [];
      e.subject.each(part => {
        removedNodes.push(part.data);
      });
      removeNodesInDiagram(removedNodes);
    });
    diagram.current.addDiagramListener("TextEdited", e => {
      const editedTextBlock = e.subject;
      const newEditText = editedTextBlock.text;
      const nodeData = editedTextBlock.part.data;
      nodeData.element.changeName(newEditText)

      // Needed?? diagram.current.model.setDataProperty(data, "name", newValue);
      //changeParameterName(textBlock.data.element, newValue)
    })

    $.current = go.GraphObject.make
    diagram.current.div = diagramRef.current;

    createEditorNodeTemplate("observable")
    createEditorNodeTemplate("observer")
    createParNodeTemplate("parameter")
  }, [])

  // when name is changed in editor, the name should also be changed in diagram
  useEffect(() => {
    if (renamedElement) {
      const newNodeDataArray = calculateNewNodeDataArray(nodeDataArray, renamedElement[0])
      changeNodeDataArray(newNodeDataArray)
    }
  }, [renamedElement])

  function createEditorNodeTemplate(name) {
    const nodeTemplate =
      $.current(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "location").makeTwoWay(),
        $.current(go.Shape,
          { fill: "white", strokeWidth: 2 },
          new go.Binding("fill", "fill"),
          new go.Binding("stroke", "border")),
        $.current(go.Panel, "Vertical",
          $.current(go.TextBlock,
            {
              margin: 4, editable: true, font: "bold 14px sans-serif",
              isMultiline: false, width: 80, textAlign: "center"
            },
            new go.Binding("text", "name").makeTwoWay()),
          $.current("Button",
            new go.Binding("element", "element"),
            {
              margin: 2,
              click: nodeClickFunction
            },
            $.current(go.TextBlock, "Editor"))
        ));
    diagram.current.nodeTemplateMap.add(name, nodeTemplate)
  }

  function createParNodeTemplate(name) {
    const nodeTemplate =
      $.current(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "location").makeTwoWay(),
        $.current(go.Shape,
          { fill: "white", strokeWidth: 2 },
          new go.Binding("fill", "fill"),
          new go.Binding("stroke", "border")),
        $.current(go.Panel, "Vertical",
          $.current(go.TextBlock,
            {
              margin: 4, editable: true, font: "bold 14px sans-serif",
              isMultiline: false, width: 80, height: 25, textAlign: "center"
            },
            new go.Binding("text", "name").makeTwoWay()),
          new go.Binding("element", "element"),
          $.current(go.TextBlock,
            new go.Binding("text", "value")
          )
        ));
    diagram.current.nodeTemplateMap.add(name, nodeTemplate)
  }

  function changeParameterName(element, newValue) {
    element.changeName(newValue)
  }

  function nodeClickFunction(e, obj) {
    var node = obj.part;
    var data = node.data;

    const newNodeDataArray = setNewActiveEditor(data.element, model.current.nodeDataArray)
    changeNodeDataArray(newNodeDataArray)
  }

  function setNewActiveEditor(element, prevNodeDataArray) {
    var newNodeDataArray = prevNodeDataArray
    // prev active editor out
    const prevActiveEditor = prevNodeDataArray.find(node => (node.id === activeEditorRef.current))
    if (prevActiveEditor) {
      prevActiveEditor.element.fill = UNSELECTEDFILL
      newNodeDataArray = calculateNewNodeDataArray(newNodeDataArray, prevActiveEditor.element)
    }

    // new active editor in
    changeActiveEditor(element.id)
    activeEditorRef.current = element.id
    element.fill = SELECTEDFILL

    newNodeDataArray = calculateNewNodeDataArray(newNodeDataArray, element)
    return newNodeDataArray
  }

  // ON OBSERVABLE EMITION
  useEffect(() => {
    // highlight observable / observer / parameter flows that fired 
    // + update all parameter values linked to that observable
    // for i = 1 to length of emittedValues:
    // if prev /= new ==> highlight (observables[i])
    const newEmittedValuesArray = observables.map(observable => {
      return observable.emittedValues
    });
    const newParameterValues = parameters.map(param => {
      return param.value
    });

    var ElementsToHighlight = []
    for (let i = 0; i <= prevEmittedValuesArray.current.length; i++) {
      if (prevEmittedValuesArray.current[i] !== newEmittedValuesArray[i]) {
        ElementsToHighlight.push(observables[i])
        observables[i].observers.forEach(observer => {
          ElementsToHighlight.push(observer)
          ElementsToHighlight = ElementsToHighlight.concat(observer.parameters)
          observer.parameters.forEach(parameter => calculateNewNodeDataArray(nodeDataArray, parameter))
        })
      }
    }
    highlightElementNodes(ElementsToHighlight)

    prevEmittedValuesArray.current = newEmittedValuesArray
    prevParameterValues.current = newParameterValues

  }, [firedObservables])

  function highlightElementNodes(elements) {
    var tempNodeDataArray = nodeDataArray

    elements.forEach(element => {
      if (element.border !== ERRORBORDER) {
        element.border = HIGHLIGHTBORDER
        tempNodeDataArray = calculateNewNodeDataArray(tempNodeDataArray, element)
        changeNodeDataArray(tempNodeDataArray)
      }

    })
    setTimeout(() => {
      elements.forEach(element => {
        if (element.border !== ERRORBORDER) {
          element.border = NORMALBORDER
          tempNodeDataArray = calculateNewNodeDataArray(tempNodeDataArray, element)
          changeNodeDataArray(tempNodeDataArray)
        }
      })
    }, 500)
  }

  // ON ELEMENT ADDITION / REMOVAL
  useEffect(() => {
    // check new observables? Compare observables and prevObservables
    var newObservables = observables.filter(element => !prevObservables.current.includes(element));
    var removedObservables = prevObservables.current.filter(element => !observables.includes(element));
    newObservables = newObservables.map(observable => createNewNode(observable, observableRow, observableColumn))
    prevObservables.current = observables
    // update observable emittedvalues array
    prevEmittedValuesArray.current = observables.map(observable => {
      return observable.emittedValues
    });

    // check new observers
    var newObservers = observers.filter(element => !prevObservers.current.includes(element));
    var removedObservers = prevObservers.current.filter(element => !observers.includes(element));
    newObservers = newObservers.map((observer) => createNewNode(observer, observerRow, observerColumn))
    prevObservers.current = observers

    // check new parameters
    var newParams = parameters.filter(element => !prevParameters.current.includes(element));
    var removedParams = prevParameters.current.filter(element => !parameters.includes(element));
    newParams = newParams.map((parameter) => createNewNode(parameter, parameterRow, parameterColumn))
    prevParameters.current = parameters

    const nodesToRemove = [...removedObservables, ...removedObservers, ...removedParams]
    const cleanedNodeDataArray = removeNodesInBackend(nodeDataArray, nodesToRemove)

    // change nodeArray
    changeNodeDataArray([...cleanedNodeDataArray, ...newObservables, ...newObservers, ...newParams])
  }, [observables, observers, parameters])

  function createNewNode(element, elementRow, elementColumn) {
    const node = constructNode(element, elementRow, elementColumn.current);
    elementColumn.current = elementColumn.current + 60

    return node
  }

  function removeNodesInDiagram(removedNodesArray) {
    // function that removes nodes from backend arrays if nodes are removed by user from diagram
    var newObservablesArray = [...prevObservables.current]
    var newObserversArray = [...prevObservers.current]
    var newParametersArray = [...prevParameters.current]
    removedNodesArray.forEach(removedNode => {
      if (removedNode.category === "observable") {
        newObservablesArray = newObservablesArray.filter(observable => observable.id !== removedNode.id)
      } else if (removedNode.category === "observer") {
        newObserversArray = newObserversArray.filter(observer => observer.id !== removedNode.id)
      } else if (removedNode.category === "parameter") {
        newParametersArray = newParametersArray.filter(parameter => parameter.id !== removedNode.id)
      }
    })
    changeObservables(newObservablesArray)

    prevObservables.current = newObservablesArray
    changeObservers(newObserversArray)
    prevObservers.current = newObserversArray
    changeParameters(newParametersArray)
    prevParameters.current = newParametersArray
  }

  function removeNodesInBackend(oldNodeDataArray, nodesToRemoveArray) {
    // function that removes nodes from diagram arrays when nodes are removed in backend arrays (for example when visual is uploaded from files)
    const nodeIdsToRemove = new Set(nodesToRemoveArray.map(node => node.id));
    const newNodeDataArray = oldNodeDataArray.filter(node => !nodeIdsToRemove.has(node.id))
    return newNodeDataArray
  }

  // ON MODEL CHANGE ==> DIAGRAM SHOULD CHANGE
  useEffect(() => {
    // update the diagram model when nodeDataArray or linkDataArray change
    model.current.nodeDataArray = nodeDataArray
    model.current.linkDataArray = linkDataArray
    diagram.current.model = model.current
  }, [nodeDataArray, linkDataArray])

  function constructNode(element, elementRow, elementColumn) {
    var valueString
    if (element.value) {
      try {
        valueString = element.value.toString()
      } catch (error) {
        valueString = "no string repr" // parameter with value that is not representable as a string
      }
    } else (valueString = undefined) // no value (observable / observer)

    const node = {
      id: element.id,
      key: element.id,
      name: element.name,
      category: element.category,
      element: element,
      color: element.color,
      location: new go.Point(elementRow, elementColumn),
      value: valueString,
      fill: element.fill,
      border: element.border
    }
    //elementRow += 1
    return node
  }

  function calculateNewNodeDataArray(prevNodeDataArray, element) {
    const elementNodeIndex = prevNodeDataArray.findIndex(node => node.id === element.id);
    const nodeToUpdate = prevNodeDataArray[elementNodeIndex]
    const newNodeDataArray = [...prevNodeDataArray]
    if (elementNodeIndex !== -1) {
      nodeToUpdate.name = element.name
      nodeToUpdate.category = element.category
      nodeToUpdate.value = element.value
      nodeToUpdate.fill = element.fill
      nodeToUpdate.border = element.border
      newNodeDataArray[elementNodeIndex] = nodeToUpdate;
    }
    return newNodeDataArray
  }

  // ON RUN OF INPUTS: 
  function createLinks() {
    // connect nodes
    const linkArray1 = connectObsvblsToObsvrs()
    const linkArray2 = connectObsvrsToParams()
    const newLinkDataArray = linkArray1.concat(linkArray2)
    changeLinkArray(newLinkDataArray);
  }

  useEffect(() => {
    createLinks()

    // make failing nodes red
    var newNodeDataArray = nodeDataArray
    const allEditorNodes = observables.concat(observers)
    allEditorNodes.forEach(editorNode => {
      if (editorNode.errorMessage.length > 0) {
        console.log("error!", editorNode)
        editorNode.border = ERRORBORDER
      } else {
        editorNode.border = NORMALBORDER
      }
      newNodeDataArray = calculateNewNodeDataArray(nodeDataArray, editorNode)
    })
    changeNodeDataArray(newNodeDataArray)
  }, [run])

  function connectObsvblsToObsvrs() {
    var links = []
    observables.forEach(observable => {
      observable.observers.forEach(observer => {
        const link = createNewLink(observable, observer)
        links = [...links, link]
      })
    })
    return links
  }

  function connectObsvrsToParams() {
    var links = []
    observers.forEach(observer => {
      observer.parameters.forEach(parameter => {
        const link = createNewLink(observer, parameter)
        links = [...links, link]
      })
    })
    return links
  }

  function createNewLink(element1, element2) {
    return constructLink(element1, element2);
  }

  function constructLink(element1, element2) {
    return { from: element1.id, to: element2.id }
  }

  return <div ref={diagramRef} style={{ position: 'relative', top: 0, left: 0, zIndex: 1, height: "100%", width: "100%" }}>
  </div>
}


export default InputDiagram 