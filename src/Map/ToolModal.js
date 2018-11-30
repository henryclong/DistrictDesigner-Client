import React, { Component } from 'react';
import { toggleAlgorithm, stopAlgorithm } from '../helpers/district-designer';

class ToolModal extends Component {

  onStart = () => {
  }

  onPause = () => {
    toggleAlgorithm();
  }

  onStop = () => {
    stopAlgorithm();
  }

  render() {
    return (
      <div>
        <h1>ToolModal Component</h1>
        <button onClick={() => this.onStart()}>Start</button>
        <button onClick={() => this.onPause()}>Pause</button>
        <button onClick={() => this.onStop()}>Stop</button>
      </div>
    );
  }
}

export default ToolModal;
