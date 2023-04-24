import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/search/match-highlighter";
import * as go from 'gojs';
import { Observer } from "./observer_editor";
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
  run
}) {
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
      removeNodes(removedNodes);
    });
    $.current = go.GraphObject.make
    // define a grid layout with 3 columns
    /*     diagram.current.layout = $.current(go.LayeredDigraphLayout, {
          layerSpacing: 50,
          columnSpacing: 20
        }); */
    diagram.current.div = diagramRef.current;

    createEditorNodeTemplate("observable")
    createEditorNodeTemplate("observer")
    createParNodeTemplate("parameter")


    // selected node
    // error node
  }, [])

  function removeNodes(removedNodesArray) {
    console.log("old arrays: ", prevObservables.current, prevObservers.current, prevParameters.current)

    removedNodesArray.forEach(removedNode => {
      if (removedNode.category === "observable") {
        console.log("filtered array: ", prevObservables.current.filter(observable => observable.name !== removedNode.name))
        changeObservables(prevObservables.current.filter(observable => observable.name !== removedNode.name))
      } else if (removedNode.category === "observer") {
        changeObservers(prevObservers.current.filter(observer => observer.name !== removedNode.name))
      } else if (removedNode.category === "parameter") {
        changeParameters(prevParameters.current.filter(parameter => parameter.name !== removedNode.name))
      }
    })

  }

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
          $.current(go.TextBlock,
            new go.Binding("text", "value")
          )
        ));
    diagram.current.nodeTemplateMap.add(name, nodeTemplate)
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
    const prevActiveEditor = prevNodeDataArray.find(node => (node.name === activeEditorRef.current))
    if (prevActiveEditor) {
      prevActiveEditor.element.fill = UNSELECTEDFILL
      newNodeDataArray = calculateNewNodeDataArray(newNodeDataArray, prevActiveEditor.element)
    }

    // new active editor in
    changeActiveEditor(element.name)
    activeEditorRef.current = element.name
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
    const newObservables = observables.filter(element => !prevObservables.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    newObservables.forEach((observable) => createNewNode(observable, observableRow, observableColumn.current))
    observableColumn.current = observableColumn.current + 60

    // removed observables are already removed in the diagram as this is the place where removal is initiated

    prevObservables.current = observables
    // update observable emittedvalues array
    prevEmittedValuesArray.current = observables.map(observable => {
      return observable.emittedValues
    });
    console.log("newest observables array: ", observables, prevObservables.current)
  }, [observables])

  useEffect(() => {
    console.log("observers new effect")

    // check new observers? Compare observers and prevObservers
    const newObservers = observers.filter(element => !prevObservers.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    newObservers.forEach((observer) => createNewNode(observer, observerRow, observerColumn.current))
    observerColumn.current = observerColumn.current + 60

    // removed observers are already removed in the diagram as this is the place where removal is initiated

    prevObservers.current = observers

    console.log("newest observers array: ", observers, prevObservers.current)

  }, [observers])

  useEffect(() => {
    console.log("params new effect")

    // check new observers? Compare observers and prevObservers
    const newParams = parameters.filter(element => !prevParameters.current.includes(element));
    // If yes ==> add node: createNewNode(newElement)
    newParams.forEach((parameter) => {
      createNewNode(parameter, parameterRow, parameterColumn.current)
    })
    parameterColumn.current = parameterColumn.current + 60


    // removed parameters are already removed in the diagram as this is the place where removal is initiated

    prevParameters.current = parameters

    console.log("newest parameters array: ", parameters, prevParameters.current)
  }, [parameters])

  function createNewNode(element, elementRow, elementColumn) {
    console.log("create node with location: ", elementRow, elementColumn)
    const node = constructNode(element, elementRow, elementColumn);
    var newNodeDataArray = [...nodeDataArray, node];
    if (element.coreCategory !== "parameter") {
      newNodeDataArray = setNewActiveEditor(element, newNodeDataArray)
    }

    changeNodeDataArray(newNodeDataArray);
  }

  // ON MODEL CHANGE ==> DIAGRAM SHOULD CHANGE
  useEffect(() => {
    console.log("new nodeDataArray effect: ", nodeDataArray)
    // update the diagram model when nodeDataArray or linkDataArray change
    model.current.nodeDataArray = nodeDataArray
    model.current.linkDataArray = linkDataArray
    diagram.current.model = model.current
  }, [nodeDataArray, linkDataArray])

  function constructNode(element, elementRow, elementColumn) {
    const node = {
      key: element.name,
      name: element.name,
      category: element.category,
      element: element,
      color: element.color,
      location: new go.Point(elementRow, elementColumn),
      value: element.value,
      fill: element.fill,
      border: element.border
    }
    //elementRow += 1
    return node
  }

  function calculateNewNodeDataArray(prevNodeDataArray, element) {
    const elementNodeIndex = prevNodeDataArray.findIndex(node => node.name === element.name);
    const nodeToUpdate = prevNodeDataArray[elementNodeIndex]
    const newNodeDataArray = [...prevNodeDataArray]
    if (elementNodeIndex !== -1) {
      nodeToUpdate.category = element.category
      nodeToUpdate.value = element.value
      nodeToUpdate.fill = element.fill
      nodeToUpdate.border = element.border
      newNodeDataArray[elementNodeIndex] = nodeToUpdate;
    }
    return newNodeDataArray
  }

  // ON RUN OF INPUTS: 
  useEffect(() => {
    // connect nodes
    const linkArray1 = connectObsvblsToObsvrs()
    const linkArray2 = connectObsvrsToParams()
    const newLinkDataArray = linkArray1.concat(linkArray2)
    changeLinkArray(newLinkDataArray);

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
      observable.observers = []
      observers.forEach(observer => {
        if (observer.code.includes(observable.name)) {
          observable.observers = [...observable.observers, observer]
          const link = createNewLink(observable, observer)
          links = [...links, link]
        }
      })
    })
    return links
  }

  function connectObsvrsToParams() {
    var links = []
    observers.forEach(observer => {
      observer.parameters = []
      parameters.forEach(parameter => {
        if (observer.code.includes(parameter.name)) {
          observer.parameters = [...observer.parameters, parameter]
          const link = createNewLink(observer, parameter)
          links = [...links, link]
        }
      })
    })
    return links
  }

  function createNewLink(element1, element2) {
    return constructLink(element1, element2);
  }

  function constructLink(element1, element2) {
    return { from: element1.name, to: element2.name }
  }

  return <div ref={diagramRef} style={{ position: 'relative', top: 0, left: 0, zIndex: 1, height: "100%", width: "100%" }}>
  </div>
}


export default InputDiagram 