import React from 'react'

function Ham_options(props) {
    const handlehampopup = () => {
        let chk = document.getElementById("hpop");
        chk.classList.toggle("visible");
      };
  return (<>
  <div
    className="options"
    // onClick={() => {
    //   let chk = document.getElementById("pop_inp");
    //   chk.classList.toggle("visible");
    //   handlehampopup();
    // }}
  >
    {props.action}
    {/* <{...props.actionicon}/> */}
  </div>
  </>
  )
}

export default Ham_options