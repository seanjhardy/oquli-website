export const ProgressBar = ({value}) => {
  return (
    <div className={"progress-bar"}>
      <div className={"progress"}
           style={{width: `${value*100}%`}}/>
      <div className={"progress-circle"} style={{left: `calc(${value*100}% - 10px)`}}/>
    </div>
  )
}