import {useEffect, useRef, useState} from "react";
import {Tree} from "../../components/tree/tree";
import {isMobile} from "react-device-detect";

export const TreeView = ({root, onClickNode}) => {
  const treeViewRef = useRef();
  const treeViewInnerRef = useRef();

  //Arrays storing SVG elements and tree node elements
  const [SVGData, setSVGData] = useState([])
  const [treeNodes, setTreeNodes] = useState([])

  const [tree, setTree] = useState(null);

  let mouseDown = false;
  let startX, scrollLeft;

  const startDragging = (e) => {
    mouseDown = true
    startX = e.pageX - treeViewRef.current.offsetLeft;
    scrollLeft = treeViewRef.current.scrollLeft;
  }

  const stopDragging = (e) => {
    mouseDown = false
  }

  const move = (e) => {
    e.preventDefault();
    if(!mouseDown) { return; }
    const x = e.pageX - treeViewRef.current.offsetLeft;
    const scroll = x - startX;
    treeViewRef.current.scrollTo(scrollLeft - scroll, 0);
  }

  const render = () => {
    let tree = new Tree(root)

    //Always centre tree view when resizing
    treeViewRef.current.scrollTo(treeViewInnerRef.current.offsetWidth/2 - treeViewRef.current.offsetWidth/2, 0)

    // Compute bounds of viewable area
    const viewBounds = treeViewRef.current.getBoundingClientRect()

    // Create the SVG lines
    const treeLines = tree.renderTreeBranches(tree.root)
    setSVGData(treeLines)

    // Create the tree node components
    const treeNodes = tree.renderTreeNodes(tree.root, viewBounds, onClickNode)
    setTreeNodes(treeNodes)

    setTree(tree)
  }

  useEffect(() => {
    render()

    // Add event listener to re-render tree when window is resized
    window.addEventListener("resize", render)

    // Enable horizontal scrolling on smaller displays
    if (window.innerWidth < 1000) {
      treeViewRef.current.addEventListener('mousemove', move, false);
      treeViewRef.current.addEventListener('mousedown', startDragging, false);
      treeViewRef.current.addEventListener('mouseup', stopDragging, false);
      treeViewRef.current.addEventListener('mouseleave', stopDragging, false);
    }


    // Remove event listeners
    return () => {
      window.removeEventListener("resize", render)
      treeViewRef.current.removeEventListener('mousemove', move, false);
      treeViewRef.current.removeEventListener('mousedown', startDragging, false);
      treeViewRef.current.removeEventListener('mouseup', stopDragging, false);
      treeViewRef.current.removeEventListener('mouseleave', stopDragging, false);
    }
  }, [])


  return (
    <div className={"tree-view"} ref={treeViewRef}>
      <div className={"tree-view-inner"} ref={treeViewInnerRef}>
        <svg style={{width: "100%", height: "100%"}}
             vectorEffect={"non-scaling-stroke"}
             viewBox={`0 0 ${tree?.bounds.width} ${tree?.bounds.height}`}>
          {/*Render the SVG data for the tree*/}
          {SVGData}
        </svg>
        {/*Render the tree nodes*/}
        {treeNodes}
      </div>
    </div>
  )
}