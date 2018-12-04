import DisplayModal from './DisplayModal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import { startAlgorithm, toggleAlgorithm, stopAlgorithm } from '../helpers/district-designer';
import { createMap, loadState, unloadState } from '../helpers/mapGeneration';

let map;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomed: false,
      selectedState: 'none',
      terminalUpdates: [],
      showingDistricts: false,
    };
  }

  componentDidMount() {
    map = createMap();
  }

  appendText(text) {
    const outputText = this.state.terminalUpdates.concat(text);
    this.setState({ terminalUpdates: outputText });
  }

  clearOutput = () => {
    this.setState({ terminalUpdates: [] });
  }

  onToggle = () => {
    toggleAlgorithm(false);
    this.appendText('Algorithm Paused');
  }

  onStart = (weights, algorithm) => {
    startAlgorithm(algorithm, this.state.selectedState.shortName, weights)
    let weightText = '';
    weights.map((weight) => (weightText += (weight.id + ': ' + weight.value + ' ')));
    this.appendText("Algorithm Started: Weights: " + weightText + " State: " + this.state.selectedState.shortName + " Algorithm Type: " + algorithm);
    
  }

  onStop = () => {
    stopAlgorithm();
    this.appendText('Algorithm Stopped');
  }

  resetZoom = () => {
    unloadState(map, this.state.selectedState.shortName);
    this.setState({
      zoomed: false,
      selectedState: 'none',
    });
    map.flyTo({center: [-95.7, 39], zoom: 3.75});
  }

  toggleDistrictView = () => {
    if (!this.state.showingDistricts) {
      map.addLayer({
      'id': 'districtBorders',
      'type': 'line',
      'source': 'districtSource',
      'paint': {
        'line-color': '#800000',
        'line-width': 2.0
      }
      });
      map.setFilter('districtBorders', ['==', 'STATEFP', '55']);
      this.setState({ showingDistricts: true});
    }
    else {
      map.removeLayer('districtBorders');
      this.setState({ showingDistricts: false});
    }
  }

  stateZoom = (usstate) => {
    this.setState({
      zoomed: true,
      selectedState: usstate
    });
    loadState(map, usstate.shortName);
    map.flyTo(usstate.boundingBox);
  }

  updateSettings = (weights, algorithm) => {
    this.weights = weights;
    this.algorithm = algorithm;
  }

  render() {
    return (
      <div>
        <div id='map'></div>
        <DisplayModal
          zoomed={this.state.zoomed}
          terminalUpdates={this.state.terminalUpdates}
        />
        <ToolModal
          zoomed={this.state.zoomed}
          stateZoom={this.stateZoom}
          toggleDistrictView={this.toggleDistrictView}
          resetZoom={this.resetZoom}
          selectedState={this.state.selectedState}
          onStart={this.onStart}
          onToggle={this.onToggle}
          onStop={this.onStop}
          updateSettings={this.updateSettings}
        />
      </div>
    );
  }
}

export default Map;


