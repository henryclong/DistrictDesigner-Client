import React, { Component } from 'react';
import Select from 'react-select';

class StateSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      selectedState: null,
    };
  }

  searchBegin = () => {
    this.setState({ searching: true });
  }

  searchEnd = () => {
    this.setState({ searching: false });
  }

  selectState = (state) => {
    this.setState({ searching: false });
    this.props.states
      .filter(usState => usState.shortName === state.shortName)
      .map((usState) => ( this.props.stateZoom(usState.shortName, usState.boundingBox) ))
  }

  render(){
    if(!this.state.searching) {
      return ( <button onClick={() => this.searchBegin()}>Select State</button> )
    }
    else {
      return (
        <div className="StateSelector">
          <button onClick={() => this.searchEnd()}>← Close</button>
          <Select
            value={this.state.selectedState}
            onChange={this.selectState}
            options={this.props.states}
          />
        </div>
      )
    }
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
