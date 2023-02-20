function InputSelection() {
  // function to configure a new input datastream and link it to a variable
  var dataStreams = []
  
  function configureNewInput() {
    var dataStream = addInputDataStream()
    linkStreamToVariable(dataStream)
  }

  // 
  function addInputDataStream() {

  }

  //
  function linkStreamToVariable(dataStream) {

  }

  return <div>
    <h3> input selection </h3>
    <button onClick={configureNewInput}>+</button>
    // LIST ALL INPUTS OF ARRAY dataStreams
  </div>
}

export default InputSelection