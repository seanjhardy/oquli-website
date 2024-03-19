import {getTreeBranchPath, interpolateColour} from "../../modules/GUIHelper";
import "./node.css"

/**
 * Class representing a tree node object
 * @property data - Object containing data stored by this node
 * @property parent - Stores relation to parent node
 * @property children - stores list of child nodes
 * @property depth - Distance of this node from the root
 * @property maxDepth - Maximum depth found in all child nodes
 * @property angle - The angle of this node when drawn in the circular tree
 * @property position {x, y} - position of the node in the tree
 * @property state - the state of this node "funded"/"funding"/"locked"
 */
export class Node {
  data;
  parent;
  children;
  depth;
  maxDepth;
  angle;
  position;
  unlocked;

  constructor({value,
                parent = null,
                depth = 0,
              }) {
    this.depth = depth;
    this.maxDepth = 1;
    this.angle = 0;

    // Extract children from data
    const {children, ...nodeCopy} = value
    this.data = nodeCopy;
    this.parent = parent;
    this.children = [];

    //Set state
    if (value.funding === 1) {
      this.state = "funded"
    } else if (value.funding < 1) {
      this.state = "funding"
    } else {
      this.state = "locked"
    }

    //Propagate the new maximum depth to the parent nodes
    this.updateMaxDepth(1);

    value.children?.forEach((child) => {
      const node = new Node({
        value: child,
        parent: this,
        depth: depth + 1,
      })
      this.children.push(node);
    });
  }

  /**
   * Update the maximum depth of this node based on the new child depth
   * @param depth
   */
  updateMaxDepth(depth) {
    this.maxDepth = Math.max(this.maxDepth, depth);
    if (this.parent != null) {
      this.parent.updateMaxDepth(depth + 1);
    }
  }

  /**
   * Count the total number of nested children this node has
   * @return {number}
   */
  getNumTotalChildren() {
    if (this.children.length === 0) {
      return 1
    }
    let children = 0;
    this.children.forEach((child) => {
      children += child.getNumTotalChildren()
    })
    return children;
  }

  /**
   * Returns react element corresponding to this node
   * @param nodeProps
   * @param treeBounds
   * @param viewBounds
   * @param onClickNode
   * @return {JSX.Element}
   */
  render (nodeProps, treeBounds, viewBounds, onClickNode) {
    const viewportRatio = viewBounds.width / treeBounds.width
    const size = Math.max((nodeProps.size) * viewportRatio, 80)

    const left = `calc(${100 * this.position.x / treeBounds.width}% - ${size / 2}px)`
    const top = `calc(${100 * this.position.y / treeBounds.height}% - ${size / 2}px)`

    return (
      <div className={"node " + (this.state !== "locked" ? "clickable" : "")}
       style={{
          width: size, height: size,
          left,
          top,
        }}
       key={this.position.x + " " + this.position.y + " " + this.angle}
       onClick={() => {
         if (this.state !== "locked") onClickNode(this.data)
       }}>
        <div className={"node-bg"}>
        {this.data.icon && (
          <img src={this.data.icon} className={"node-icon"} alt={"tree-icon"}/>
        )}
        {!this.data.icon && (
          <span>{this.data.title}</span>
        )}
        </div>
      </div>
    )
  }

  /**
   * Returns this node's branch as an SVG
   * @param child
   * @param bounds
   * @param nodeProps
   * @return {*[]}
   */
  drawBranch(child, bounds, nodeProps) {
    const svgdata = []
    //Compute positions of node and child in the tree view
    const path = getTreeBranchPath(this, child, nodeProps)

    //Set the branch colour
    const colour = this.state === "locked" ? "#222222" : "var(--primary)"

    svgdata.push(<path
      d={path}
      key={path}
      stroke={colour}
      fill={"transparent"}
      strokeWidth={4}
      strokeLinecap={"square"}
      vectorEffect={"non-scaling-stroke"}
    />)
    return svgdata
  }
}
