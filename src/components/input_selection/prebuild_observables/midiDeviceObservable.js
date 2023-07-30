
import { Obsvable } from "../observable";


var prebuildObservables = []

// MIDI
const midiObservable = new Obsvable(0)
const midiCode = `
const midiInputsObservable = navigator.requestMIDIAccess().then(midiAccess => {
  const midiInputs = midiAccess.inputs
  const inputObservables = Array.from(midiInputs.values()).map(input => rxjs.fromEvent(input, 'midimessage').pipe(
    rxjs.map(event => event.data)))
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
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const freqArray = new Float32Array(analyser.frequencyBinCount);

const audioObservable = navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    var source = audioCtx.createMediaStreamSource(stream);
  	source.connect(analyser);

    // Start the audio processing
    analyser.connect(audioCtx.destination);
  // fill the Float32Array with data returned from getFloatFrequencyData()
  const Audioobservable = rxjs.interval(1000).pipe(rxjs.map(x => {  analyser.getFloatFrequencyData(freqArray);}))
  return Audioobservable
  })
return audioObservable
     `
audioObservable.changeCode(audioCode)
audioObservable.changeName("audioSignal")

prebuildObservables.push(audioObservable)


// interval
const intervalObservable = new Obsvable(3)
const intervalCode = `
const numbers = rxjs.interval(1000);
 
return numbers
`

intervalObservable.changeCode(intervalCode)
intervalObservable.changeName("interval")

prebuildObservables.push(intervalObservable)








export default prebuildObservables



