import "./tree.css"
import {useRef, useState} from "react";
import {TreeView} from "./treeView";
import {TreeNodePopup} from "./tree-node-popup";

export const TreePage = ({}) => {
  const ref = useRef();
  const [popup, setPopup] = useState(null)
  const [root, setRoot] = useState({
    title: "Scout",
    userInput: 0.56,
    funding: 0.6,
    softwareCompletion: 0.7,
    betaProgress: 0.45,
    background: require("../../assets/images/backgrounds/placeholder.png"),
    icon: require("../../assets/images/icons/scout.png"),
    children: [
      {
        title: "???"
      },
      {
        title: "???",
        children: [
          {
            title: "???",
            children: [{title: "???"}, {title: "???"}, {title: "???"}]
          }, {
            title: "???",
            children: [{title: "???"}, {title: "???"}]
          }, {
            title: "???",
            children: [{title: "???"}, {title: "???"}, {title: "???"}]
          }
        ]
      },
      {
        title: "???",
        children: [{title: "???"}, {
          title: "???",
          children: [{title: "???"}, {title: "???"}, {title: "???"}]
        }, {title: "???"}]
      },
    ]
  })

  return (
    <div className="tree-page" ref={ref}>
      {/* Tree view */}
      <TreeView style={{width: "100%", height: "100%"}}
                root={root} onClickNode={(data) => setPopup(data)}/>

      {/* Tree popup */}
      <TreeNodePopup popup={popup} onClose={() => setPopup(null)}/>
    </div>
  )
}