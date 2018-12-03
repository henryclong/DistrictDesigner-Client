import React, { Component } from 'react';

class StateSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      enteredText: '',
    };
  }

  searchBegin = () => {
    this.setState({ searching: true });
  }

  searchEnd = () => {
    this.setState({ searching: false });
  }

  selectState = (stateShortName) => {
    this.setState({ searching: false });
    this.props.states
      .filter(usState => usState.shortName === stateShortName)
      .map((usState) => ( this.props.stateZoom(stateShortName, usState.boundingBox) ))
  }

  textChanged = (text) => {
    let searchText = document.getElementById('stateSearchBar');
    if(searchText != null){
      this.setState({ enteredText: searchText.value });
    }
  }

  render(){
    if(!this.state.searching) {
      return (
        <button onClick={() => this.searchBegin()}>Select State</button>
      )
    }
    else {
      return (
        <div className="StateSelector">
          <button onClick={() => this.searchEnd()}>← Close</button>
          <input id="stateSearchBar" type="text" placeholder="Search" onInput={(value) => this.textChanged(value)}></input>
          <ul>
            {
              this.props.states.map((item) => {
                if(item.shortName.toUpperCase().includes(this.state.enteredText.toUpperCase()) || item.longName.toUpperCase().includes(this.state.enteredText.toUpperCase())){
                  return (
                    <li key={"state"+item.id}>
                      <button onClick={() => this.selectState(item.shortName)}>
                        [{item.shortName}] {item.longName}
                      </button>
                    </li>
                  )
                }
                else return ('');
              })
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
      id: '45',
      shortName: 'SC',
      longName: 'South Carolina',
      boundingBox: {
        center: [-81, 34],
        zoom: 6.5,
      },
    },
    {
      id: '49',
      shortName: 'UT',
      longName: 'Utah',
      boundingBox: {
        center: [-112, 39],
        zoom: 5.5,
      },
    },
    {
      id: '55',
      shortName: 'WI',
      longName: 'Wisconsin',
      boundingBox: {
        center: [-89.36, 44.87],
        zoom: 6,
      },
    },
  ],
  sliderMax: 20,
};

export default StateSelector;
