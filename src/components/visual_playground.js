import React, { useState, useEffect } from "react";
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";
import '../App.css';
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import InputSelection from "./input_selection/input_selection_old";


function VisualPlayground() {
  const [code, setCode] = useState(`
  var canvas
  var test = 200
  p.setup = () => {
    canvas = start_canvas()
  };

  p.draw = () => {
  	const b_colour = test % 256
	  const c_colour = 256 - test % 256

    console.log('test')
    p.background(b_colour);
    test = test + 1;
  	p.translate(canvas.width / 2, canvas.height / 2);
	p.fill(c_colour)
	p.noStoke
    p.circle(0, 0, 500)
  };
  `);

  function handleCodeChange(editor, data, value) {
    setCode(value);
  }

  const sketch = (p) => {
    function start_canvas() {
      const parent = document.getElementById("output-canvas")
      const canvas = p.createCanvas(parent.offsetWidth, parent.offsetHeight);
      canvas.parent("output-canvas");
      return canvas
    }
    try {
      eval(code)
    } catch (error) {
      console.log("error")
    }
  };

  return (
    <div id="editor" style={{ width: "100%", height: "100%"}}>
      <Controlled
      className="CodeMirror"
        value={code}
        onBeforeChange={handleCodeChange}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
        }}
      />
      <div>
        <Sketch sketch={sketch} />
      </div>
    </div>
  );
}

export default VisualPlayground;
