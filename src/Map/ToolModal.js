import React, { Component } from 'react';
import { startAlgorithm, pauseAlgirithm, stopAlgorithm } from '../helpers/district-designer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SLIDER_COUNT = 3;

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
          <Slider id={"weightSlider" + i} min={0} max={10} defaultValue={5}></Slider>
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
        {this.createSliders(SLIDER_COUNT)}
        <button onClick={() => this.onStart()}>Start</button>
        <button onClick={() => this.onPause()}>Pause</button>
        <button onClick={() => this.onStop()}>Stop</button>
      </div>
    );
  }
}

export default ToolModal;
