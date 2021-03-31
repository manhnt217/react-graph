import React from 'react';
import { BiZoomIn } from 'react-icons/bi'
import { BiZoomOut } from 'react-icons/bi'
import './graph.css';

const Graph = ({ size, children }) => {
  const minZoomLevel = 10.0;
  const svgEl = React.useRef(undefined);
  const graphWrapperEl = React.useRef(undefined);
  const [graphHeight, updateGraphHeight] = React.useState(1000.0);
  const [[dragging, dragX, dragY], updateDrag] = React.useState([false, 0, 0]);
  const [[viewBoxX, viewBoxY, zoomLevel], setZoom] = React.useState([0.0, 0.0, 100.0]);

  React.useEffect(() => {
    updateGraphHeight(svgEl.current.getBoundingClientRect().width)
  });

  const getMousePos = (mouseEvent) => {
    const rect = svgEl.current.getBoundingClientRect();
    const mouseX = mouseEvent.clientX - rect.left;
    const mouseY = mouseEvent.clientY - rect.top;

    const scaleRatio = zoomLevel / rect.width

    return [scaleRatio * mouseX, scaleRatio * mouseY];
  }

  const handleWheel = (e) => {
    const [mouseX, mouseY] = getMousePos(e);
    handleZoom(mouseX, mouseY, e.deltaY * 0.001)
  }

  const handleZoom = (mouseX, mouseY, multiplicator) => setZoom(([prevViewBoxX, prevViewBoxY, prevZoomLevel]) => {
    const z = prevZoomLevel * (2 ** multiplicator)
    const newZoomLevel = z < minZoomLevel ? minZoomLevel : z
    const ratio = newZoomLevel * 1.0 / prevZoomLevel;
    const newVX = prevViewBoxX - mouseX * (ratio - 1);
    const newVY = prevViewBoxY - mouseY * (ratio - 1);

    return [newVX, newVY, newZoomLevel];
  });

  const handleMouseDown = (e) => updateDrag([true, ...getMousePos(e)]);
  const handleMouseUp = () => updateDrag([false, dragX, dragY]);
  const handleMouseMove = (e) => {
    const [currentMouseX, currentMouseY] = getMousePos(e);
    if (dragging) {
      setZoom(([prevViewBoxX, prevViewBoxY, prevZoomLevel]) => [prevViewBoxX + dragX - currentMouseX, prevViewBoxY + dragY - currentMouseY, prevZoomLevel])
      updateDrag([true, currentMouseX, currentMouseY]);
    }
  }

  const zoom = (multiplicator) => () => {
    const svgRect = svgEl.current.getBoundingClientRect();
    const wrapperRect = graphWrapperEl.current.getBoundingClientRect();
    const scaleRatio = zoomLevel / svgRect.width
    const centerX = scaleRatio * svgRect.width / 2;
    const centerY = scaleRatio * Math.min(svgRect.height, wrapperRect.height) / 2;
    handleZoom(centerX, centerY, multiplicator);
  }

  return (
    <div className="graph-wrapper" style={{width: size}} ref={graphWrapperEl}>
      <svg className="graph"
        width="100%" height={graphHeight}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseUp}
        viewBox={`${viewBoxX} ${viewBoxY} ${zoomLevel} ${zoomLevel}`}
        ref={svgEl}>
        {children}
      </svg>

      <div className="zoomBtnGroup">
        <BiZoomIn style={{width: '2em', height: '2em'}} onClick={zoom(-0.2)} />
        <BiZoomOut style={{width: '2em', height: '2em'}} className="btn" onClick={zoom(0.2)} />
      </div>
    </div>
  );
}

export { Graph };
