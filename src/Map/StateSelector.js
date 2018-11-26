import React, { Component } from 'react';

class StateSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
    };
  }

  beginSearch = () => {
    this.setState({ searching: true });
  }

  endSearch = () => {
    this.setState({ searching: false });
  }

  selectState = () => {
    this.setState({ searching: false });
  }

  render(){
    if(!this.state.searching) {
      return (
        <button onClick={() => this.beginSearch()}>Select State</button>
      )
    }
    else {
      return (
        <div className="StateSelector">
          <button onClick={() => this.endSearch()}>← Close</button>
          <input type="text" placeholder="Search"></input>
        </div>
      )
    }
  }
  
}

export default StateSelector;
