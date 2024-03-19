import {useEffect, useRef, useState} from "react";
import {Tree} from "../../components/tree/tree";

export const TreeView = ({root, onClickNode}) => {
  const treeViewRef = useRef();
  const treeViewInnerRef = useRef();

  //Arrays storing SVG elements and tree node elements
  const [SVGData, setSVGData] = useState([])
  const [treeNodes, setTreeNodes] = useState([])

  const [tree, setTree] = useState(null);

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

    // Remove event listener
    return () => {
      window.removeEventListener("resize", render)
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