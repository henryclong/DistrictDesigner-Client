import React, { Component } from 'react';
import Select from 'react-select';

class StateSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedState: null,
    };
  }

  selectState = (state) => {
    this.props.stateZoom(state);
  }

  render(){
    return (
      <div className="StateSelector">
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          value={this.state.selectedState}
          onChange={this.selectState}
          options={this.props.states}
        />
      </div>
    )
  }
  
}

StateSelector.defaultProps = {
  states: [
    {
      id: '45',
      shortName: 'SC',
      label: 'South Carolina',
      boundingBox: {
        center: [-81, 34],
        zoom: 6.5,
      },
    },
    {
      id: '49',
      shortName: 'UT',
      label: 'Utah',
      boundingBox: {
        center: [-112, 39],
        zoom: 5.5,
      },
    },
    {
      id: '55',
      shortName: 'WI',
      label: 'Wisconsin',
      boundingBox: {
        center: [-89.36, 44.87],
        zoom: 6,
      },
    },
  ],
  sliderMax: 20,
};

export default StateSelector;
