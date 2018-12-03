import React, { Component } from 'react';

class DisplayModal extends Component {

  clear = () => {
    this.props.clearOutput();
  }

  render() {
    return (
      (this.props.zoomed)?
        <div className="Modal DisplayModal">
            <p id="outputTextArea" class="outputTextarea">
            {
              this.props.terminalUpdates.map((text) => {
                return(
                  <div>
                    {text}
                    <br />
                    <br />
                  </div>)
              })
            }
            </p>
            <button onClick={() => {this.clear()}}>Clear</button>
        </div>
        :<div></div>
    );
  }
}

export default DisplayModal;
