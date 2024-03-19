const is = {
  hex: (a) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
  rgb: (a) => /^rgb/.test(a),
  hsl: (a) => /^hsl/.test(a),
  col: (a) => is.hex(a) || is.rgb(a) || is.hsl(a),
}

const convertToRgba = (colour) => {
  return is.hex(colour) ? hexToRgba(colour) : is.rgb(colour) ? rbgToRgba(colour) : colour
}

const hexToRgba = (colour, alpha = 1) => {
  const [r, g, b] = colour.match(/\w\w/g).map((x) => parseInt(x, 16))
  return `rgba(${r},${g},${b},${alpha})`
}

const rbgToRgba = (colour, alpha = 1) => {
  const [r, g, b] = colour.replace(/[^\d,]/g, "").split(",")
  return `rgba(${r},${g},${b},${alpha})`
}


export const deconstructRgba = (rgba) => {
  return rgba
    .replace(/[^\d,]/g, "")
    .split(",")
    .map((x) => {
      return parseFloat(x)
    })
}

const formatRbga = (colour) => {
  return `rgba(${colour.r},${colour.g},${colour.b},${colour.a})`
}

export const interpolateColour = (colourA, colourB, progress) => {
  const [r1, g1, b1, a1] = deconstructRgba(convertToRgba(colourA))
  const [r2, g2, b2, a2] = deconstructRgba(convertToRgba(colourB))
  return formatRbga({
    r: Math.round((r2 - r1) * progress + r1),
    g: Math.round((g2 - g1) * progress + g1),
    b: Math.round((b2 - b1) * progress + b1),
    a: Math.round((a2 - a1) * progress + a1),
  })
}

export const clamp = (min, x, max) => {
  return Math.min(Math.max(min, x), max)
}

export function LineTo(x, y) {
  return "L" + x + " " + y + " "
}
export function MoveTo(x, y) {
  return "M" + x + " " + y + " "
}

export function ArcTo(nodeAngle, childAngle, radius, centerX, centerY) {
  //Determines if the arc should curve inwards or outwards
  const sweepFlag = (nodeAngle - childAngle) < 0 ? 1 : 0;

  //Get the end coordinates based on the angle and radius of the arc
  const endX = centerX + radius * Math.cos(childAngle);
  const endY = centerY + radius * Math.sin(childAngle);

  return `A${radius},${radius} 0 0,${sweepFlag} ${endX},${endY}`;
}

/**
 * Calculates the SVG path data for an arc line from the node to the child, arcing around the center point
 * @param node - the node to arc from
 * @param child - the node to arc towards
 * @param nodeProps - the properties of each node
 * @return {string}
 */
export function getTreeBranchPath(node, child, nodeProps) {
  //Compute distance from node to child
  const distToChild = nodeProps.rowSpacing + nodeProps.size
  //Convert angles to radians
  const nodeAngleRadians = node.angle * Math.PI /180
  const childAngleRadians = child.angle * Math.PI/180
  //Get halfway point between node and child along its angle
  const halfwayPoint = {
    x: node.position.x + Math.cos(nodeAngleRadians) * distToChild / 2,
    y: node.position.y + Math.sin(nodeAngleRadians) * distToChild / 2
  }

  //Distance from the centre node to the halfway point
  const distanceFromCenter = Math.sqrt(
    (halfwayPoint.x - nodeProps.startX) ** 2 +
    (halfwayPoint.y - nodeProps.startY) ** 2)

  //Start at the node position, adding padding for the line
  let pathString = MoveTo(
    node.position.x + (Math.cos(nodeAngleRadians) *
    (nodeProps.size/2 + nodeProps.lineGapSize)),
    node.position.y + (Math.sin(nodeAngleRadians) *
    (nodeProps.size/2 + nodeProps.lineGapSize)));

  //Move half the distance in the direction of the current angle
  pathString += LineTo(
    node.position.x + (Math.cos(nodeAngleRadians) * distToChild / 2),
    node.position.y + (Math.sin(nodeAngleRadians) * distToChild / 2));

  //Move in a circle to the angle to the child node, halfway along the distance
  pathString += ArcTo(nodeAngleRadians, childAngleRadians, distanceFromCenter, nodeProps.startX, nodeProps.startY)

  // Move to the start of the child node, minus padding for the line
  pathString += LineTo(
    child.position.x - Math.cos(childAngleRadians) *
    (nodeProps.size/2 + nodeProps.lineGapSize),
    child.position.y - Math.sin(childAngleRadians) *
    (nodeProps.size/2 + nodeProps.lineGapSize));

  return pathString;
}