import React, { Component } from 'react';

class DisplayModal extends Component {

  clear = () => {
    this.props.clearOutput();
  }

  render() {
    if(this.props.zoomed){
      return (
          <div className="Modal DisplayModal">
              <p id="outputTextArea" class="outputTextarea">
              {
                this.props.terminalUpdates.map((text) => {
                  return(
                    <div>{text}<br></br><br></br></div>)
                })
              }
              </p>
              
              <button onClick={() => {this.clear()}}>Clear</button>
          </div>
      );
    }
    else{
      return (
        <div></div>
      )
    }
  }
}

export default DisplayModal;
