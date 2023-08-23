import { useState, memo, useRef, useEffect } from "react";
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";
import { timeout } from "rxjs";

var PAR = {}
var GLOB = {}

function Output({ selected, paramsDict, globDict, state, updateVisualWidth, updateVisualHeight, visualWidth, visualHeight, visualCode, setCodeErrorMessage }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvas = document.getElementById('output-canvas');
  console.log("rerender output")

  // CAN BE IMPROVED SO THAT IT DOESNT RUN WITH EVERY VISUALCODE CHANGE
  useEffect(() => {
    PAR = paramsDict
    GLOB = globDict
  }, [paramsDict, globDict, state]);

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

  useEffect(() => {
    // Add event listener for fullscreenchange event
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  return <div ref={ref} id="output-canvas" style={{ height: "100%", width: "100%", position: "relative" }}>
    <VisualMemoize visualCode={visualCode} canvasWidth={visualWidth} canvasHeight={visualHeight} setCodeErrorMessage={setCodeErrorMessage} />
    {!isFullscreen ?
      (<button onClick={openFullScreen} style={{ position: "absolute", bottom: 0, right: 0 }}>
        [  ]
      </button>) : null
    }
  </div>
}

const MemoizedOutput = memo(Output);

// Difficulty: I wanted the input parameters to update constantly, to be up to date with every event,
// while the output I want to run smoothly, and not rerender constantly. For that I needed to use Memo
function Visual({ visualCode, canvasWidth, canvasHeight, setCodeErrorMessage }) {
  const sketch = (p5) => {
    function start_canvas() {
      const canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL);
      canvas.parent("output-canvas");
      return canvas
    }
    var canvas
    p5.setup = () => {
      canvas = start_canvas()
    };
    try {
      eval(visualCode)
      setTimeout(() => {
        setCodeErrorMessage(undefined)
      },
        3000)

    } catch (error) {
      setTimeout(() => {
        setCodeErrorMessage(error)
      },
        3000)
    }
  };
  return <div>
    <Sketch sketch={sketch} />
  </div>
}

const VisualMemoize = memo(Visual)

export { MemoizedOutput, Output } 