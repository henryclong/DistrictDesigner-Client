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
        <button onClick={() => this.selectState()}>Searching</button>
      )
    }
  }
  
}

export default StateSelector;
