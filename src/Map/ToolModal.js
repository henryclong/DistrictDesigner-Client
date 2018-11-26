import React, { Component } from 'react';
import Slider from 'rc-slider';
import { resetZoom, stateZoom } from '../Map/index';
import { startAlgorithm, pauseAlgirithm, stopAlgorithm, clearOutput } from '../helpers/district-designer';
import 'rc-slider/assets/index.css';

class ToolModal extends Component {

  constructor(props) {
    super(props);
    this.weights = [];
  }

  componentDidUpdate() {
    this.props.weights.map((item) => (this.updateWeight(item.id, this.props.sliderMax/2)));
  }

  onStart = () => {
    startAlgorithm(this.weights, null, null);
  }

  onPause = () => {
    pauseAlgirithm();
  }

  onStop = () => {
    stopAlgorithm();
  }

  zoomOut = () => {
    this.props.setZoom(false);
    resetZoom();
  }

  zoomIn = () => {
    this.props.setZoom(true);
    clearOutput();
    stateZoom();
  }

  updateWeight = (sliderId, newWeight) => {
    console.log('updating weight for weight # ' + sliderId + ' from ' + this.weights[sliderId] + ' to ' + newWeight);
    this.weights[sliderId] = (newWeight / this.props.sliderMax).toFixed(2);
    let weightLabel = document.getElementById('weightLabel' + sliderId);
    if(weightLabel != null) weightLabel.innerHTML = this.weights[sliderId];
  }

  render() {
    if(this.props.zoomed === true){
      return (
        <div className="Modal ToolModal">
          <button onClick={() => this.zoomOut()}>← Return to State Select</button>
          {
            this.props.weights.map((item) => (
                <div>
                  <label name={"weightTitle"}>{item.label}</label>
                  <div class="weightContainer">
                    <Slider id={"weightSlider"+item.id} min={0} max={this.props.sliderMax} defaultValue={this.props.sliderMax/2} onAfterChange={(value) => {this.updateWeight(item.id, value)}}></Slider>
                    <label id={"weightLabel"+item.id}>-1</label>
                  </div>
                </div>
            ))
          }
          <button onClick={() => this.onStart()}>Start</button>
          <button onClick={() => this.onPause()}>Pause</button>
          <button onClick={() => this.onStop()}>Stop</button>
        </div>
      );
    }
    else {
      return (
        <div className="Modal ToolModal">
          <button onClick={() => this.zoomIn()}>Zoom In [TEST]</button>
        </div>
      );
    }
  }
}

ToolModal.defaultProps = {
  weights: [
    {
      id: '0',
      label: 'Compactness',
      value: 'COMPACTNESS',
    },
    {
      id: '1',
      label: 'Weight 2',
      value: 'WEIGHT_2',
    },
    {
      id: '2',
      label: 'Weight 3',
      value: 'WEIGHT_3',
    },
  ],
  sliderMax: 20,
};

export default ToolModal;
