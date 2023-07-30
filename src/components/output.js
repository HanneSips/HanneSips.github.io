import { useState, memo, useRef, useEffect } from "react";
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";

var params = {}

function Output({ selected, paramsDict, updateVisualWidth, updateVisualHeight, visualWidth, visualHeight, visualCode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvas = document.getElementById('output-canvas');
  console.log("rerender output")

  // CAN BE IMPROVED SO THAT IT DOESNT RUN WITH EVERY VISUALCODE CHANGE
  useEffect(() => {
    params = paramsDict
  }, [paramsDict, visualCode]);

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

  return <div ref={ref} id="output-canvas" style={{ height: "100%", width: "100%" }}>
    {!isFullscreen ?
      (<button onClick={openFullScreen}></button>) :
      (<button onClick={closeFullScreen}></button>)}
    <VisualMemoize visualCode={visualCode} visualWidth={visualWidth} visualHeight={visualHeight} />
  </div>
}

const MemoizedOutput = memo(Output);

// Difficulty: I wanted the input parameters to update constantly, to be up to date with every event,
// while the output I want to run smoothly, and not rerender constantly. For that I needed to use Memo
function Visual({ visualCode, visualWidth, visualHeight }) {
  const sketch = (p) => {
    function start_canvas() {
      const canvas = p.createCanvas(visualWidth, visualHeight, p.WEBGL);
      canvas.parent("output-canvas");
      return canvas
    }
    var canvas
    p.setup = () => {
      canvas = start_canvas()
    };
    try {
      eval(visualCode)
    } catch (error) {
      console.log("error running visual", error)
    }
  };
  return <div>
    <Sketch sketch={sketch} />
  </div>
}

const VisualMemoize = memo(Visual)

export { MemoizedOutput, Output } 