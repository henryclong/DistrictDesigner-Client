import React, { Component } from 'react';
import { startAlgorithm, pauseAlgirithm, stopAlgorithm } from '../helpers/district-designer';

class ToolModal extends Component {

  onStart = () => {
    startAlgorithm();
  }

  onPause = () => {
    pauseAlgirithm();
  }

  onStop = () => {
    stopAlgorithm();
  }

  createSliders(sliderCount) {
    let sliders = [];
    for(let i = 0; i < sliderCount; i++){
      sliders.push(
        <div>
          <label name={"weightlLabel" + i}>weight{i}</label>
          <input type="range" id={"weightSlider" + i} name={"weightSlider" + i} min="0" max="10" defaultValue="5" step="1"></input>
        </div>
      );
    }
    return sliders;
  }

  normalizeWeights() {

  }

  render() {
    return (
      <div className="Modal ToolModal">
        <h1>ToolModal Component</h1>
        {this.createSliders(3)}
        <button onClick={() => this.onStart()}>Start</button>
        <button onClick={() => this.onPause()}>Pause</button>
        <button onClick={() => this.onStop()}>Stop</button>
      </div>
    );
  }
}

export default ToolModal;
