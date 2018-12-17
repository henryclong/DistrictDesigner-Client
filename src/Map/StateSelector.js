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
          options={this.props.usstates}
        />
      </div>
    )
  }
  
}

StateSelector.defaultProps = {
  sliderMax: 20,
};

export default StateSelector;
