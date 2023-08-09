import React from 'react'
import Ham_options from './Ham_options';
function Hamburger(props) {
    const handlehampopup = () => {
        let chk = document.getElementById("hpop");
        chk.classList.toggle("visible");
      };
    
  return (
    <div className="hamcon">
            <div className="hamburger" onClick={handlehampopup}>
              <div className="hline"></div>
            </div>
            <div className="ham_options" id="hpop">
              {/* <div
                className="options"
                onClick={() => {
                  let chk = document.getElementById("pop_inp");
                  chk.classList.toggle("visible");
                  handlehampopup();
                }}
              >
                {props.issueone}
                {props.issueiconone}
              </div> */}
              <Ham_options 
               onClick={() => {
                handlehampopup();
              }}
              />
            </div>
          </div>
  )
}

export default Hamburger