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
    let weightMap = {};
    weights.map((w) => (weightMap[w.id] = w.value));
    const result = startAlgorithm(algorithm, this.state.selectedState.shortName, weightMap);
    this.appendText((result)?"Algorithm Started: Weights: " + weights.map((w) => w.id + ": " + w.value) + " State: " + this.state.selectedState.shortName + " Algorithm Type: " + algorithm:"ERROR");
    return result;
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

  stateZoom = (usstate) => {
    this.setState({
      zoomed: true,
      selectedState: usstate
    });
    loadState(map, usstate.shortName);
    map.flyTo(usstate.boundingBox);
  }
  
  toggleDistrictView = () => {
    if (!this.state.showingDistricts) {
      map.addLayer({
        'id': 'districtFill',
        'type': 'fill',
        'source': 'districtSource',
        'paint': {
          'fill-color': '#0a369d',
          "fill-opacity": 1.0,
        }
      });
      map.addLayer({
        'id': 'districtBorders',
        'type': 'line',
        'source': 'districtSource',
        'paint': {
          'line-color': '#FFFFFF',
          'line-width': 0.5
        }
      });
      map.setFilter('districtFill', ['==', 'STATEFP', this.state.selectedState.id]);
      map.setFilter('districtBorders', ['==', 'STATEFP', this.state.selectedState.id]);
      this.setState({ showingDistricts: true});
    }
    else {
      map.removeLayer('districtFill');
      map.removeLayer('districtBorders');
      this.setState({ showingDistricts: false});
    }
  }

  render() {
    return (
      <div>
        <div id='map'></div>
        <DisplayModal
          zoomed={this.state.zoomed}
          terminalUpdates={this.state.terminalUpdates}
          clearOutput={this.clearOutput}
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


