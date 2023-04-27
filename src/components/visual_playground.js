import React, { useState, useEffect } from "react";
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";
import '../App.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';


function VisualPlayground({ visualCode, changeVisualCode }) {
  function handleCodeChange(editor, data, value) {
    editor.showHint({ completeSingle: false });
    changeVisualCode(value)
  }

  //console.log("render playground")

  return (
    <div id="editor" style={{ maxWidth: "100%", height: "100%" }}>
      <Controlled
        className="CodeMirror"
        value={visualCode}
        onBeforeChange={handleCodeChange}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
          lineWrapping: true,
          smartIndent: true,
          foldGutter: true,
          gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          autoCloseTags: true,
          keyMap: 'sublime',
          matchBrackets: true,
          autoCloseBrackets: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete'
          },
          hintOptions: {
          },
          styleActiveLine: true,
          styleActiveSelected: true,

          highlightSelectionMatches: {
            minChars: 2,
            showToken: /Hello/,
            style: 'matchhighlight'
          }
        }}
      />
    </div>
  );
}

export default VisualPlayground;
