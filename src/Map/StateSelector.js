import React, { Component } from 'react';

class StateSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      enteredText: '',
    };
    this.textChanged = this.textChanged.bind(this);
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

  textChanged(text) {
    let searchText = document.getElementById('stateSearchBar');
    if(searchText != null){
      this.setState({ enteredText: searchText.value });
    }
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
          <input id="stateSearchBar" type="text" placeholder="Search" onInput={(value) => this.textChanged(value)}></input>
          <ul>
            {
              this.props.states.map((item) => {
                if(item.shortName.toUpperCase().includes(this.state.enteredText.toUpperCase()) || item.longName.toUpperCase().includes(this.state.enteredText.toUpperCase())){
                  return (
                    <li key={"state"+item.id}>
                      <button onClick={() => this.selectState(item.shortName)}>[{item.shortName}] {item.longName}</button>
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
      id: '55',
      shortName: 'WI',
      longName: 'Wisconsin',
    },
    {
      id: '56',
      shortName: 'SC',
      longName: 'South Carolina',
    },
    {
      id: '57',
      shortName: 'UT',
      longName: 'Utah',
    },
  ],
  sliderMax: 20,
};

export default StateSelector;
