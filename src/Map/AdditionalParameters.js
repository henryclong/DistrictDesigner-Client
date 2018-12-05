import React, { Component } from 'react';

class AdditionalParameters extends Component {

  updateParameters = () => {
    
  }

  render(){
    return (
      <div className="AdditionalParameters">
        {
          this.props.radioOptions.seedSelection.map((item) => (
            <div key={item.value + 'Container'}>
              <div className="weightContainer">
                <input 
                  defaultChecked={item.default} 
                  id={item.value} 
                  name="algorithmRadio" 
                  onClick={() => {this.props.updateParameters(item.value)}}
                  type="radio"
                  disabled={this.state.isAlgorithmRunning}
                />
                <span className="radio"></span>
                <label name={"algorithmTitle"}>{item.label}</label>
              </div>
            </div>
        ))
        }
      </div>
    )
  }
  
}

AdditionalParameters.defaultProps = {
  //'districtCount',
  //'moveSelect',
  //'seedSelection',
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

export default AdditionalParameters;
