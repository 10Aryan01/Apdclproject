import React from "react";

function Noti_his(props) {
  return (
    <div className="noti_his_list">
      <div
        className="test"
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div
          className="n_date"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label
            style={{
              fontSize: "10px",
            }}
          >
           Date and time
          </label>
          {props.date}
        </div>
        <div className="n_issue" style={{ display: "flex",flexDirection: "column" }}>
        <label
            style={{
              fontSize: "10px",
            }}
          >
            Notification
          </label>
          {props.issue}
        </div>
        <div className="subdiv" style={{ display: "flex",flexDirection: "column" }}>
        <label
            style={{
              fontSize: "10px",
            }}
          >
            District
          </label>
          {props.district}
        </div>
        <div className="subdiv" style={{ display: "inline-block" }}>
          {props.subdiv}
        </div>
      </div>
    </div>
  );
}

export default Noti_his;
