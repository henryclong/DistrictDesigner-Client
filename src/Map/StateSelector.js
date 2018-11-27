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

  selectState = (stateShortName) => {
    this.setState({ searching: false });
    this.props.stateZoom(stateShortName);
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
          <ul>
            {
              this.props.states.map((item) => (
              <li>
                <button onClick={() => this.selectState()}>[{item.shortName}] {item.longName}</button>
              </li>))
            }
          </ul>
        </div>
      )
    }
  }
  
}

StateSelector.defaultProps = {
  states: [
    {
      id: '55',
      shortName: 'WI',
      longName: 'Wisconsin',
    },
    {
      id: '56',
      shortName: 'NW',
      longName: 'NotWisconsin',
    },
    {
      id: '56',
      shortName: 'NW',
      longName: 'NotWisconsin',
    },
    {
      id: '56',
      shortName: 'NW',
      longName: 'NotWisconsin',
    },
    {
      id: '56',
      shortName: 'NW',
      longName: 'NotWisconsin',
    },
    {
      id: '56',
      shortName: 'NW',
      longName: 'NotWisconsin',
    },
  ],
  sliderMax: 20,
};

export default StateSelector;
