import {ProgressBar} from "../../components/progress-bar/progress-bar";
import {Popup} from "../../components/popup/popup";

export const TreeNodePopup = ({popup, onClose}) => {
  if (popup == null) return;

  return (
    <Popup show={true} onClose={onClose} className={"node-popup"}>
      <div className={"close-btn"} onClick={onClose}>
        <img src={require("../../assets/images/icons/close.png")}
             style={{width: 20, height: 20, objectFit: "contain"}}/>
      </div>
      <div style={{width: "100%", height: popup.background ? 200 : 100, position: "relative"}}>
        {popup.background && (
          <img src={popup.background} className={"node-popup-background"}/>
        )}
        <div className={"node-popup-title-row"}>
          <img src={popup.icon} style={{objectFit: "contain", width: 50, height: 50}}/>
          <span style={{fontSize: 35, fontWeight: 600}}>
            {popup?.title}
          </span>
        </div>
      </div>
      <div className={"popup-data-grid"}>
          <div className={"popup-data-field"}>
            <span>User Input</span>
            <div className={"popup-data-bar"}>
              <ProgressBar value={popup?.userInput}/>
              <span>{`${Math.round(popup?.userInput*100)}%`}</span>
            </div>
          </div>

          <div className={"popup-data-field"}>
            <span>Funding</span>
            <div className={"popup-data-bar"}>
              <ProgressBar value={popup?.funding}/>
              <span>{`${Math.round(popup?.funding*100)}%`}</span>
            </div>
          </div>

          <div className={"popup-data-field"}>
            <span>Software Completion Milestone</span>
            <div className={"popup-data-bar"}>
              <ProgressBar value={popup?.softwareCompletion}/>
              <span>{`${Math.round(popup?.softwareCompletion*100)}%`}</span>
            </div>
          </div>

          <div className={"popup-data-field"}>
            <span>Beta Progress</span>
            <div className={"popup-data-bar"}>
              <ProgressBar value={popup?.betaProgress}/>
              <span>{`${Math.round(popup?.betaProgress*100)}%`}</span>
            </div>
        </div>
      </div>
      {/*
        <div style={{padding: 20, display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
          <div className={"popup-btn"}>
            <span>Fund</span>
          </div>
        </div>
      */}
    </Popup>
  )
}