import React, { Component } from 'react';
import Slider from 'rc-slider';

class ParameterSelector extends Component {

  constructor(props){
    super(props);
    const params = {};
    if(this.props.parameters.includes('seedSelect')) params['seedSelect'] = 'RANDOM';
    if(this.props.parameters.includes('districtCount')) params['districtCount'] = '8';
    if(this.props.parameters.includes('moveSelect')) params['moveSelect'] = 'BEST';
    this.state = {
      parameters: params
    };
    this.sendUpdates();
  }

  updateParameter = (name, value) => {
    const newParams = this.state.parameters;
    newParams[name] = value;
    this.setState({
      parameters: newParams,
    })
    this.sendUpdates();
  }

  updateDistrictCount = (value) => {
    const newParams = this.state.parameters;
    newParams['districtCount'] = value;
    this.setState({
      parameters: newParams,
    });
    this.sendUpdates();
  }

  sendUpdates = () => {
    this.props.updateParameters(this.state.parameters);
  }

  render(){
    return (
      <div className="ParameterSelector">
        {
          (this.props.parameters.includes('seedSelect'))?
          <div>
            <label>Seed Select</label>
            {this.props.radioOptions.seedSelection.map((item) => (
              <div key={item.value + 'Container'}>
                <div className="weightContainer">
                  <input 
                    defaultChecked={item.default} 
                    id={item.value} 
                    name="seedRadio" 
                    onClick={() => {this.updateParameter('seedSelect', item.value)}}
                    type="radio"
                    disabled={this.props.isAlgorithmRunning}
                  />
                  <span className="radio"></span>
                  <label name={"seedTitle"}>{item.label}</label>
                </div>
              </div>
            ))}
          </div>:<div/>  
        }
        {
          (this.props.parameters.includes('seedSelect')&&this.props.parameters.includes('districtCount')&&this.state.parameters['seedSelect'] === 'RANDOM')?
          <div>
            <label>District Count</label>
            <div className="weightContainer">
            <Slider
              defaultValue={8} //Change to get current districtCount from state
              id={"districtCountSlider"} 
              max={10} //Change to be 2-3 times the default
              min={1} 
              onChange={this.updateDistrictCount}
              disabled={this.props.isAlgorithmRunning}
            />
            <label id={"districtCountLabel"}>
              {this.state.parameters.districtCount || -1}
            </label>
            </div>
          </div>:<div/>
        }
        {
          (this.props.parameters.includes('moveSelect'))?
          <div>
            <label>Move Select</label>
            {this.props.radioOptions.moveSelection.map((item) => (
              <div>
                <div key={item.value + 'Container'}>
                  <div className="weightContainer">
                    <input 
                      defaultChecked={item.default} 
                      id={item.value} 
                      name="moveRadio" 
                      onClick={() => {this.updateParameter('moveSelect', item.value)}}
                      type="radio"
                      disabled={this.props.isAlgorithmRunning}
                    />
                    <span className="radio"></span>
                    <label name={"moveTitle"}>{item.label}</label>
                  </div>
                </div>
              </div>
            ))}
          </div>:<div/>
        }
      </div>
    )
  }
  
}

ParameterSelector.defaultProps = {
  radioOptions: {
    seedSelection: [
      {
        label: 'Random Precincts',
        value: 'RANDOM',
        default: true,
      },
      {
        label: 'Incumbent Precincts',
        value: 'INCUMBENT',
        default: false,
      }
    ],
    moveSelection: [
      {
        label: 'Best Move',
        value: 'BEST',
        default: true,
      },
      {
        label: 'Worst Move',
        value: 'WORST',
        default: false,
      },
      {
        label: 'Random Move',
        value: 'RANDOM',
        default: false,
      },
    ]
  }
};

export default ParameterSelector;
