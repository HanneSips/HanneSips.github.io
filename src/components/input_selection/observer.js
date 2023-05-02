import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import * as rxjs_lib from 'rxjs';
import { UNSELECTEDFILL, NORMALBORDER } from "./layoutVars";
import { v4 as uuidv4 } from 'uuid';


class Observer {
  constructor(number, name = undefined, code = undefined) {
    this.id = uuidv4()

    if (name) {
      this.name = name
    } else this.name = `#OBSVR${number}`

    if (code) {
      this.code = code
    } else this.code = `
    return obs["#OBS0"].subscribe(
      () => { params["#PARAM0"] = params["#PARAM0"] + 10; }
    )`;
    this.highlight = 0
    this.errorMessage = ''
    this.category = 'observer'
    this.rowNumber = number
    this.columnNumber = 1
    this.parameters = []
    this.fill = UNSELECTEDFILL
    this.border = NORMALBORDER
  }

  changeCategory(newCategory) {
    this.category = newCategory
  }

  setCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  newHighlight() {
    this.highlight += 1
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage
  }
}

export { Observer }