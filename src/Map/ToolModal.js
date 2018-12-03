import React, { Component } from 'react';
import Slider from 'rc-slider';
import StateSelector from "./StateSelector"
import 'rc-slider/assets/index.css';

class ToolModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      weights: this.props.weights,
      algorithm: this.props.algorithms[0].value,
    };
  }

  componentDidMount() {
    this.props.weights.map((item) => (this.updateWeight(item.id, this.props.sliderMax/2)));
  }

  onToggle = (toggle) => {
    this.props.onToggle(toggle);
  }

  onStart = () => {
    this.props.onStart(this.state.weights, this.state.algorithm)
  }
  
  onStop = () => {
    this.props.onStop();
  }

  updateAlgorithm = (value) => {
    this.setState({ algorithm: value});
  }

  updateWeight = (sliderId, newWeight) => {
    this.setState({ weights: this.state.weights.map(element => {
      if (element.id === sliderId) {
        return {
          id: element.id,
          label: element.label,
          value: (newWeight / this.props.sliderMax).toFixed(2),
        }
      }
      return element;
    })});
    this.props.updateSettings(this.state.weights, this.state.algorithm);
  }

  zoomOut = () => {
    this.props.resetZoom();
  }

  render() {
    if(this.props.zoomed === true){
      return (
        <div className="Modal ToolModal">
          <button onClick={() => this.zoomOut()}>← Return to State Select</button>
          {
            this.props.algorithms.map((item) => (
                <div>
                  <div class="weightContainer">
                    <input 
                      checked={item.value===this.state.algorithm} 
                      id={item.value} 
                      name="algorithmRadio" 
                      onClick={() => {this.updateAlgorithm(item.value)}}
                      type="radio" 
                    />
                    <span class="radio"></span>
                    <label name={"algorithmTitle"}>{item.label}</label>
                  </div>
                </div>
            ))
          }
          {
            this.props.weights.map((item) => (
                <div>
                  <label name={"weightTitle"}>{item.label}</label>
                  <div class="weightContainer">
                    <Slider
                      defaultValue={this.props.sliderMax/2} 
                      id={"weightSlider"+item.id} 
                      max={this.props.sliderMax} 
                      min={0} 
                      onChange={(value) => {this.updateWeight(item.id, value)}}
                    />
                    <label id={"weightLabel"+item.id}>
                      {
                        this.state.weights
                        .filter(weight => weight.id === item.id)
                        .map((weight) => {return parseFloat(weight.value, 10).toFixed(2)})
                      }
                    </label>
                  </div>
                </div>
            ))
          }
          <button onClick={() => this.onStart()}>Start</button>
          <button onClick={() => this.onToggle(false)}>Pause</button>
          <button onClick={() => this.onStop()}>Stop</button>
        </div>
      );
    }
    else {
      return (
        <div className="Modal ToolModal">
          <StateSelector
            stateZoom={this.props.stateZoom}
            resetZoom={this.props.resetZoom}
          />
        </div>
      );
    }
  }
}

ToolModal.defaultProps = {
  algorithms: [
    {
      label: 'Region Growing',
      value: 'REGION_GROWING',
    },
    {
      label: 'Simulated Annealing',
      value: 'SIMULATED_ANNEALING',
    },
  ],
  weights: [
    {
      label: 'Compactness',
      id: 'COMPACTNESS',
      value: 0.5,
    },
    {
      label: 'Weight 2',
      id: 'WEIGHT_2',
      value: 0.5,
    },
    {
      label: 'Weight 3',
      id: 'WEIGHT_3',
      value: 0.5,
    },
  ],
  sliderMax: 20,
};

export default ToolModal;
