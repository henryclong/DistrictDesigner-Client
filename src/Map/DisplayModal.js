import React, { Component } from 'react';
import { clearOutput } from '../helpers/district-designer';

class DisplayModal extends Component {

  clear = () => {
    clearOutput();
  }

    render() {
      if(this.props.zoomed){
        return (
            <div className="Modal DisplayModal">
                <p id="outputTextArea" class="outputTextarea"></p>
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
