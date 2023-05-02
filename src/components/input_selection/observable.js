import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { UNSELECTEDFILL, NORMALBORDER } from "./layoutVars";
import { v4 as uuidv4 } from 'uuid';


class Obsvable {
  constructor(number, name = undefined, code = undefined) {
    this.id = uuidv4()

    if (name) {
      this.name = name
    } else this.name = `#OBS${number}`

    if (code) {
      this.code = code
    } else this.code = `//Observable
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        rxjs.filter(event => event.code === 'ArrowUp')
        ) `

    this.emittedValues = 0
    this.errorMessage = ''
    this.category = 'observable'
    this.rowNumber = number
    this.columnNumber = 1
    this.observers = []
    this.fill = UNSELECTEDFILL
    this.border = NORMALBORDER
  }


  changeCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }

  changeCategory(newCategory) {
    this.category = newCategory
  }

  emitNewValue() {
    this.emittedValues += 1
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage
  }
}

export { Obsvable }