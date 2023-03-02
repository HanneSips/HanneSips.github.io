import React, { useState } from 'react';
import VisualPlayground from './components/visual_playground'
import InputSelection from './components/input_selection/input_selection'
import Output from './components/output'
import { Obsvable } from './components/input_selection/observable_editor';
import { Observer } from './components/input_selection/observer_editor';
import * as rxjs_lib from 'rxjs';


function App() {
  const [selected, setSelected] = useState(null);
  const [observables, changeObservables] = useState([])
  const [observers, changeObservers] = useState([])
  const [parameters, changeParameters] = useState([])
  const [visualCode, changeVisualCode] = useState("")

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
    console.log(elementArray)
  }

  const handleClick = (index) => {
    setSelected(index);
  };

  function executeObs() {
    // function that puts all the code of all observable and observer editors in one string 
    // and executes it
    function execute(code) {
      try {
        console.log(code)
        eval(code)
        console.log("OK!!!!")
      } catch (error) {
        console.log(error)
        //console.log("error")
      }
    }

    var code = ``
    const rxjs = rxjs_lib

    parameters.forEach(parameter => {
      code = code + " \n" + `var ${parameter.name} = "${parameter.initialValue}"`
    })

    // make one string of all observable code
    observables.forEach(observable => {
      code = code + " \n" + observable.code
    });

    // make one string of all observer code
    observers.forEach(observer => {
      code = code + " \n" + observer.code
    });
    execute(code)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: '5px' }}>
      <Column 
        isSelected={selected === 0} 
        onClick={() => handleClick(0)} 
        content={<InputSelection 
          observables={observables} observers={observers} parameters={parameters}
          changeObservables={changeObservables} changeObservers={changeObservers}
          changeParameters={changeParameters}
          selected={selected === 0}
          addElementFunction={addElement} removeElementFunction={removeElement} 
          executeCode={executeObs}
        />}
        colour='lightgray'
      />
      <Column 
        isSelected={selected === 1} 
        onClick={() => handleClick(1)} 
        content={<VisualPlayground selected={selected} changeVisualCode={changeVisualCode}/>}
        colour='gray'
      />
      <Column 
        isSelected={selected === 2} 
        onClick={() => handleClick(2)} 
        content={<Output selected={selected} />}
        colour='lightgray'
      />
    </div>
  );
};


const Column = ({ isSelected, onClick, content, colour}) => (
  <div style={{ flex: isSelected ? 8 : 1, background: colour, 
  width: "100%", height: "100%", padding: '5px' }} onClick={onClick}>
    {content}
  </div>
);

export default App;