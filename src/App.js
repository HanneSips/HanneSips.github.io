import React, { useState, memo, useRef, useEffect } from 'react';
import * as rxjs from 'rxjs';
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";
import VisualPlayground from './components/visual_playground'
import InputSelection from './components/input_selection/input_selection'
import { Output, MemoizedOutput } from './components/output'
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";

var params = {};
var obs = {};
var subscriptions = {}

function App() {
  const [run, newRun] = useState(0)
  const [firedObservables, newObservableFired] = useState(); // integer state
  const [visualWidth, updateVisualWidth] = useState(0);
  const [visualHeight, updateVisualHeight] = useState(0)
  const [selected, setSelected] = useState(null);
  const [observables, changeObservables] = useState([])
  const [observers, changeObservers] = useState([])
  const [parameters, changeParameters] = useState([])
  const [visualCode, changeVisualCode] = useState(`
  var colour = 200
  p.draw = () => {
  	const b_colour = colour % 256
	  const c_colour = 256 - colour % 256

    p.background(b_colour);
    colour = colour + 1;
  	p.translate(canvas.width / 2, canvas.height / 2);
	  p.fill(c_colour)
	  p.noStoke
    p.circle(0, 0, params["#PARAM0"])
  };
  `);

  const handleClick = (index) => {
    setSelected(index);
  };

  function stopDynamicParams() {
    params = {}
    // delete observables
    for (const observable in obs) {
      //observable.complete()
    };
    obs = {}

    console.log("subscriptions: ", subscriptions)
    for (const subscription in subscriptions) {
      console.log("subbb: ", subscription)
      subscriptions[subscription].unsubscribe()
    }
    subscriptions = {}
  }

  function connectObsvblsToObsvrs() {
    observables.forEach(observable => {
      observable.observers = []
      observers.forEach(observer => {
        if (observer.code.includes(observable.name)) {
          observable.observers = [...observable.observers, observer]
        }
      })
    })
  }

  function connectObsvrsToParams() {
    observers.forEach(observer => {
      observer.parameters = []
      parameters.forEach(parameter => {
        if (observer.code.includes(parameter.name)) {
          observer.parameters = [...observer.parameters, parameter]
        }
      })
    })
  }

  function executeDynamicParams() {
    // function that executes all the code of all observable and observer editors

    // stop all existing observables / observers / parameters
    stopDynamicParams()

    // Create parameters
    parameters.forEach(parameter => {
      params[parameter.name] = parameter.value
    })


    // detect and store links 
    connectObsvblsToObsvrs()
    connectObsvrsToParams()

    // Create observables in async way
    const observablePromises = observables.map(observable => {
      return new Promise((resolve, reject) => {
        try {
          const obsvblFunction = new Function('rxjs', `return (async function () { ${observable.code} })();`);
          const observableReturn = obsvblFunction(rxjs).then((observableReturn) => {
            if (observableReturn instanceof rxjs.Observable) {
              obs[observable.name] = observableReturn;
              // add for each observable a subscription to higher emittedvalue number
              subscriptions[`${observable.name}_colour`] = obs[observable.name].subscribe(() => {
                observable.emitNewValue()
              })
              observable.setErrorMessage('')

              resolve();
            } else {
              observable.setErrorMessage(`observable doesn't return observable: ${observableReturn}`);
              reject();
            }
          });
        } catch (error) {
          observable.setErrorMessage(error.message);
          reject();
        }
      });
    });

    // wait until all obs returned a value (async)
    Promise.all(observablePromises).then(() => {
      createObservers()
      makeMergedObserver()
      handleStateChanges()
    }).catch((error) => {
      console.log("One or more observables failed:", error);
    });

    function createObservers() {
      // Create observers
      observers.forEach(observer => {
        try {
          const functionCode = `${observer.code}; `
          const obsrvrFunction = new Function('obs', 'params', functionCode)
          subscriptions[observer.name] = obsrvrFunction(obs, params)
          observer.setErrorMessage('')
        } catch (error) {
          console.log("error!!!")
          observer.setErrorMessage(error.message)
        }
      });
    }


    function makeMergedObserver() {
      /// for any observable that fires a new element, I want to reload all the parameters that changed value
      // Use Object.values to convert the dictionary into an array of observables
      const obsvblsList = Object.values(obs);
      console.log(obsvblsList)

      // Use merge to merge all the observables into a single observable
      var mergedObsvbls
      if (obsvblsList.length > 0) {
        mergedObsvbls = rxjs.merge(...obsvblsList);

        obs['mergedObservable'] = mergedObsvbls
        subscriptions["inputPassing"] = mergedObsvbls.subscribe(
          () => {
            // Update parameter values
            for (const key in params) {
              const visualParam = parameters.find(vp => vp.name === key)
              const old_value = visualParam.value
              const new_value = params[key]
              if (visualParam && !(new_value === old_value)) {
                visualParam.changeValue(params[key]);
              }
              //newObservableFired(Math.random());
            }
            console.log("fire new observable from merged!!")
            newObservableFired(Math.random())
          }
        )
      }
    }

    function handleStateChanges() {
      newObservableFired(Math.random());
      newRun(Math.random)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: '5px' }}>
      <Column
        isSelected={selected === 0}
        onClick={() => handleClick(0)}
        content={<InputSelection
          selected={selected === 0}
          observables={observables} observers={observers} parameters={parameters}
          changeObservables={changeObservables} changeObservers={changeObservers}
          changeParameters={changeParameters}
          executeCode={executeDynamicParams}
          firedObservables={firedObservables}
          run={run}
        />}
        colour='lightgray'
      />
      <Column
        isSelected={selected === 1}
        onClick={() => handleClick(1)}
        content={<VisualPlayground visualCode={visualCode} changeVisualCode={changeVisualCode} />}
        colour='gray'
      />
      <Column
        isSelected={selected === 2}
        onClick={() => handleClick(2)}
        content={<MemoizedOutput selected={selected === 2}
          updateVisualWidth={updateVisualWidth} updateVisualHeight={updateVisualHeight} />}
        colour='lightgray'
      />
      <VisualMemoize visualCode={visualCode} visualWidth={visualWidth} visualHeight={visualHeight} />
    </div>
  );
};


const Column = ({ isSelected, onClick, content, colour }) => (
  <div style={{
    flex: isSelected ? 8 : 1, background: colour,
    width: "100%", height: "100%", padding: '5px'
  }} onClick={onClick}>
    {content}
  </div>
);


// Difficulty: I wanted the input parameters to update constantly, to be up to date with every event,
// while the output I want to run smoothly, and not rerender constantly. For that I needed to use Memo
function Visual({ visualCode, visualWidth, visualHeight }) {
  const sketch = (p) => {
    function start_canvas() {
      const canvas = p.createCanvas(visualWidth, visualHeight);
      canvas.parent("output-canvas");
      return canvas
    }
    var canvas
    p.setup = () => {
      canvas = start_canvas()
    };
    try {
      eval(visualCode)
    } catch (error) {
      console.log("error")
    }
  };
  return <div>
    <Sketch sketch={sketch} />
  </div>
}

const VisualMemoize = memo(Visual)



export default App;

// difficulty: async observable / observer functions make the sequence of executing the code more difficult