import DisplayModal from './DisplayModal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import { startAlgorithm, pauseAlgorithm, stopAlgorithm } from '../helpers/district-designer';
import { createMap } from '../helpers/mapGeneration';

var map;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomed: false,
      selectedState: 'none',
      terminalUpdates: [],
    };
  }

  componentDidMount() {
    map = createMap();
  }

  appendText(text) {
    let outputText = this.state.terminalUpdates.concat(text);
    this.setState({ terminalUpdates: outputText });
  }

  clearOutput = () => {
    this.setState({ terminalUpdates: [] });
  }

  onPause = () => {
    pauseAlgorithm();
    this.appendText('Algorithm Paused');
  }

  onStart = (weights, algorithm) => {
    startAlgorithm(weights, this.state.selectedState, algorithm)
    let weightText = '';
    weights.map((weight) => {weightText = weightText+=(weight.id + ': ' + weight.value + ' ')});
    this.appendText("Algorithm Started: Weights: " + weightText + " State: " + this.state.selectedState + " Algorithm Type: " + algorithm);
    
  }

  onStop = () => {
    stopAlgorithm();
    this.appendText('Algorithm Stopped');
  }

  resetZoom = () => {
    this.setState({
      zoomed: false,
      selectedState: 'none',
    });
    map.flyTo({center: [-95.7, 39], zoom: 3.75});
  }

  stateZoom = (stateShortName, boundingBox) => {
    this.setState({
      zoomed: true,
      selectedState: stateShortName
    });
    map.flyTo(boundingBox);
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
          resetZoom={this.resetZoom}
          selectedState={this.state.selectedState}
          onStart={this.onStart}
          onPause={this.onPause}
          onStop={this.onStop}
          updateSettings={this.updateSettings}
        />
      </div>
    );
  }
}

export default Map;


