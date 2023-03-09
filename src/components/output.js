import { useState, memo, useRef, useEffect } from "react";

function Output({ selected, updateVisualWidth, updateVisualHeight }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvas = document.getElementById('output-canvas');
  console.log("rerender output")

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

  const ref = useRef(null);

  const handleResize = () => {
    const { width, height } = ref.current.getBoundingClientRect();
    updateVisualWidth(width);
    updateVisualHeight(height);
  };

  useEffect(() => {
    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref = {ref} id="output-canvas" style={{height: "100%", width: "100%" }}>
        {! isFullscreen ? 
        (<button onClick={openFullScreen}></button>) :
        (<button onClick={closeFullScreen}></button>)}
      </div>
}

const MemoizedOutput = memo(Output);

export {MemoizedOutput, Output} 