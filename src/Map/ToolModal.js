import React, { Component } from 'react';
import Slider from 'rc-slider';
import StateSelector from "./StateSelector"
import 'rc-slider/assets/index.css';
import { getConstitution } from '../helpers/district-designer';

class ToolModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      weights: this.props.weights,
      algorithm: this.props.algorithms[0].value,
      isAlgorithmRunning: false,
    };
  }

  componentDidMount() {
    this.props.weights.map((item) => (this.updateWeight(item.id, (this.props.sliderMax/2).toFixed(2))));
  }

  toggleConstitutionView = () => {
    const shortName = this.props.selectedState.shortName;
    const constitutionText = getConstitution(shortName);
    this.props.toggleConstitutionView(constitutionText);
  }

  onToggle = (toggle) => {
    this.props.onToggle(toggle);
  }

  onStart = () => {
    return this.props.onStart(this.state.weights, this.state.algorithm)
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
          label: element.label,
          id: element.id,
          value: (newWeight / this.props.sliderMax).toFixed(2),
        }
      }
      return element;
    })});
  }

  zoomOut = () => {
    this.props.resetZoom();
  }

  render() {
    if(this.props.zoomed === true){
      return (
        <div className="Modal ToolModal">
          <button onClick={() => this.zoomOut()} disabled={this.state.isAlgorithmRunning}>← Return to State Select</button>
          <button onClick={() => this.props.toggleConstitutionView()}>Show State Constitution</button>
          <button onClick={() => this.props.toggleDistrictView()}>Toggle District View</button>
          {
            this.props.algorithms.map((item) => (
                <div key={item.value + 'Container'}>
                  <div className="weightContainer">
                    <input 
                      defaultChecked={item.value===this.state.algorithm} 
                      id={item.value} 
                      name="algorithmRadio" 
                      onClick={() => {this.updateAlgorithm(item.value)}}
                      type="radio"
                      disabled={this.state.isAlgorithmRunning}
                    />
                    <span className="radio"></span>
                    <label name={"algorithmTitle"}>{item.label}</label>
                  </div>
                </div>
            ))
          }
          {
            this.props.weights.map((item) => (
                <div key={item.id + 'Container'}>
                  <label name={"weightTitle"}>{item.label}</label>
                  <div className="weightContainer">
                    <Slider
                      defaultValue={
                        this.state.weights
                        .filter(weight => weight.id === item.id)
                        .map((weight) => {return (parseFloat(weight.value, 10)*(this.props.sliderMax)).toFixed(2)})
                      }
                      id={"weightSlider"+item.id} 
                      max={this.props.sliderMax} 
                      min={0} 
                      onChange={(value) => {this.updateWeight(item.id, value)}}
                      disabled={this.state.isAlgorithmRunning}
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
          {
            (!this.state.isAlgorithmRunning)
            ?
            <button onClick={() => {
              this.setState({ isAlgorithmRunning: this.onStart() });
            }}>Start</button>
            :
            <div className="buttonContainer">
              <button onClick={() => {
                this.setState({ isAlgorithmRunning: false });
                this.onToggle(false)
              }}>
                Pause
              </button>
              <button onClick={() => {
                this.setState({ isAlgorithmRunning: false });
                this.onStop()
              }}>
                Stop
              </button>
            </div>
          }
          
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
      value: 0.50,
    },
    {
      label: 'Partisan Gerrymandering',
      id: 'PARTISAN_GERRYMANDERING',
      value: 0.50,
    },
    {
      label: 'Population Equality',
      id: 'POPULATION_EQUALITY',
      value: 0.50,
    },
  ],
  sliderMax: 20,
};

export default ToolModal;
