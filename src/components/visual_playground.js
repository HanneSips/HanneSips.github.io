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


const codeMirrorConfig = {
  mode: "javascript",
  theme: "material",
  lineNumbers: true,
  lineWrapping: true,
  smartIndent: true,
  foldGutter: true,
  gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  keyMap: 'sublime',
  matchBrackets: true,
  extraKeys: {
    'Ctrl-Space': 'autocomplete'
  },
  hintOptions: {
  },
  styleActiveLine: true,
  styleActiveSelected: true,
  indentUnit: 4,
  indentWithTabs: true,
  highlightSelectionMatches: {
    minChars: 2,
    showToken: /Hello/,
    style: 'matchhighlight'
  }
}

function VisualPlayground({ visualCode, changeVisualCode, codeErrorMessage }) {
  function handleCodeChange(editor, data, value) {
    editor.showHint({ completeSingle: false });
    changeVisualCode(value)
  }

  useEffect(() => {
    console.log("code error message: ", codeErrorMessage)
  }, [codeErrorMessage])

  return (
    <div style={{ maxWidth: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "1", maxWidth: "100%", overflow: "auto" }}>
        <div id="editor" style={{ maxWidth: "100%", height: "100%" }}>
          <Controlled
            className="CodeMirror"
            value={visualCode}
            onBeforeChange={handleCodeChange}
            options={codeMirrorConfig}
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>
      {codeErrorMessage && (
        <div style={{ flex: "0 0 auto", width: "100%" }}>
          <textarea
            value={`Error message: ${codeErrorMessage.message}\nError stack:\n${codeErrorMessage.stack}`}
            className={`error-message`}
            style={{ width: "100%", height: "auto", minHeight: "300px" }}
          />
        </div>
      )}
    </div>

  );
}

export { VisualPlayground, codeMirrorConfig };
