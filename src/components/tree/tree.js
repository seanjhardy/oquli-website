import {Node} from "../node/node";

export class Tree {
  root;
  bounds;

  // Editable config of node properties
  nodeProps = {
    size: 50,
    lineGapSize: 5,
    rowSpacing: 50,
    startX: 0,
    startY: 0
  };

  constructor(root) {
    // Create a new tree node object from the root
    this.root = new Node({value: root});

    //Calculate canvas size
    this.bounds = {
      x: 0,
      y: 0,
      // Width is double the greatest depth (as nodes can go left or right)
      // multiplied by the node size and row spacing for each layer
      width: (this.root.maxDepth - 1) * 2 * (this.nodeProps.size + this.nodeProps.rowSpacing)
        + this.nodeProps.size,
      // Width is equal to greatest depth - 1
      // multiplied by the node size and row spacing for each layer
      height: (this.root.maxDepth - 1) * (this.nodeProps.size + this.nodeProps.rowSpacing)
        + this.nodeProps.size + 20,
    }

    // Initial node position is centered horizontally and at the bottom of the bounds
    this.nodeProps.startX = this.bounds.x + this.bounds.width / 2
    this.nodeProps.startY = this.bounds.y + this.bounds.height - this.nodeProps.size/2 - 10

    // Calculate the angles of each node
    this.computeNodeAngles(this.root)

    // Calculate the positions of each node
    this.computeNodePositions(this.root)
  }

  /**
   * Compute the angles of each node based on how many children each node has
   * @param node - node to calculate from
   * @param arcStart - the start angle of the arc
   * @param arcWidth - the width of the angle this node's children occupy
   */
  computeNodeAngles(node, arcStart=0, arcWidth=180){
    //Set the node to point midway through its arc (minus 180 degrees to point upwards)
    node.angle = arcStart + arcWidth /2 - 180

    //Calculate the number of children this node has
    const totalChildren = node.getNumTotalChildren()

    let currentArcStart = arcStart

    //Calculate the proportion of the arc taken up by each child
    node.children.forEach((child) => {
      const childChildren = child.getNumTotalChildren()
      //Compute relative size of the arc based on the ratio of children to total
      const childArcWidth = childChildren/totalChildren * arcWidth
      //Recursively call compute function
      this.computeNodeAngles(child, currentArcStart, childArcWidth)
      //Continuously update the currentArcStart as each child takes up parts of the arc width
      currentArcStart += childArcWidth
    })
  }

  computeNodePositions(node){
    //Compute positions of node and child in the tree view
    node.position = this.getCoords(node);
    node.children.forEach((child) => {
      this.computeNodePositions(child)
    })
  }

  /**
   * Returns a list of SVG components representing the branches of the tree
   * @param node
   * @return {*[]}
   */
  renderTreeBranches(node) {
    const svgData = []

    for (const child of node.children) {
      //Draw path for each child
      const path = node.drawBranch(child, this.bounds, this.nodeProps)
      svgData.push(...path)
    }

    //recursively fetch child svg data
    node.children?.forEach((child) => {
      //Recursively draw tree
      const childsvgData = this.renderTreeBranches(child)
      svgData.push(...childsvgData)
    })

    return svgData
  }

  /**
   * Returns a list of components representing the nodes of the tree
   * @param node
   * @param viewBounds
   * @param onClickNode
   * @return {*[]}
   */
  renderTreeNodes(node, viewBounds, onClickNode){
    const nodeData = []
    node.children.forEach((child) => {
      const childNodes = this.renderTreeNodes(child, viewBounds, onClickNode)
      //Push child nodes to be rendered
      nodeData.push(...childNodes)
    })

    //Add node to list of nodes
    nodeData.push(node.render(this.nodeProps, this.bounds, viewBounds, onClickNode))

    return nodeData
  }

  /**
   * Get the coordinates of a given node
   * @param node
   * @return {{x: number, y: number}}
   */
  getCoords(node) {
    const distance = node.depth * (this.nodeProps.size + this.nodeProps.rowSpacing);

    return {
      x: this.nodeProps.startX + Math.cos(node.angle * Math.PI / 180) * distance,
      y: this.nodeProps.startY + Math.sin(node.angle * Math.PI / 180) * distance,
    }
  }
}