
import { Obsvable } from "../observable";


var prebuildObservables = []

// MIDI
const midiObservable = new Obsvable(0)
const midiCode = `
const midiInputsObservable = navigator.requestMIDIAccess().then(midiAccess => {
  const midiInputs = midiAccess.inputs
  const inputObservables = Array.from(midiInputs.values()).map(input => rxjs.fromEvent(input, 'midimessage').pipe(
    rxjs.map(event => event.data)))
  console.log("input obs: ", inputObservables)
  observableMerged = rxjs.merge(...inputObservables);
  return observableMerged
})
return midiInputsObservable
`
midiObservable.changeCode(midiCode)
midiObservable.changeName("midiSignal")

prebuildObservables.push(midiObservable)


// KEY PRESS
const keypressObservable = new Obsvable(1)
const keypressCode = `
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        // change key code here if required:
        rxjs.filter(event => event.code === 'space')
        ) `
keypressObservable.changeCode(keypressCode)
keypressObservable.changeName("keyPress")

prebuildObservables.push(keypressObservable)


// AUDIO
const audioObservable = new Obsvable(2)
const audioCode = `
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        // change key code here if required:
        rxjs.filter(event => event.code === 'space')
        ) `
audioObservable.changeCode(keypressCode)
audioObservable.changeName("audioSignal")

prebuildObservables.push(audioObservable)

export default prebuildObservables
