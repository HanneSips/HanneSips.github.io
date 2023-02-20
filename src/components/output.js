import { useState } from "react";

function Output() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvas = document.getElementById('output-canvas');

  function openFullScreen() {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
    setIsFullscreen(true);
  }

  function closeFullScreen() {
    if (canvas.exitFullscreen) {
      canvas.exitFullscreen();
    } else if (canvas.webkitExitFullscreen) {
      canvas.webkitExitFullscreen();
    } else if (canvas.msExitFullscreen) {
      canvas.msExitFullscreen();
    }
    setIsFullscreen(false);
  }

  return <div id="output-canvas" style={{height: "100%", width: "100%" }}>
    {! isFullscreen ? 
    (<button onClick={openFullScreen}></button>) :
    (<button onClick={closeFullScreen}></button>)}
  </div>
}

export default Output