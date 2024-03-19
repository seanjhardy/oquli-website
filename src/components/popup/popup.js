import React, { useEffect, useRef, useState } from "react";
import "./popup.css"

export const Popup = ({show, onClose, children, style = {}, className=""}) => {
  const ref = useRef()
  const popupBody = useRef()

  useEffect(() => {
    if (show) {
      popupBody.current.classList.add('active');
    } else {
      popupBody.current.classList.remove('active');
    }
  }, [show])


  return (
    <div id="popup"
         className={"popup"}
         style={{display: show ? "flex" : "none"}}
         ref={ref}
         onClick={(e) => {
           onClose()
         }}>
      <div className={"popup-content " + className}
           ref={popupBody}
           style={style}
           onClick={(e) => {
             e.stopPropagation();
           }}>
        {children}
      </div>
    </div>
  );
};