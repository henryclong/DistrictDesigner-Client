import DisplayModal from './DisplayModal';
import Modal from 'react-modal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import { startAlgorithm, toggleAlgorithm, stopAlgorithm, getConstitution } from '../helpers/district-designer';
import { createMap, loadState, unloadState } from '../helpers/mapGeneration';
import ConstitutionModal from './ConstitutionModal';

let map;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomed: false,
      selectedState: 'none',
      terminalUpdates: [],
      showingDistricts: false,
      constitution: {
        isActive: false,
        text: "",
      }
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

  onToggleAlgorithm = () => {
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
    map.setFilter('districtBorders', ['==', 'STATEFP', usstate.id]);
    map.flyTo(usstate.boundingBox);
  }

  toggleConstitutionView = () => {
    const constitutionText = getConstitution(this.state.selectedState.shortName);
    this.setState({
      constitution: {
        isActive: !this.state.constitution.isActive,
        text: constitutionText,
      }
    });
  }
  
  toggleDistrictView = () => {
    this.setState({ showingDistricts: !this.state.showingDistricts});
    map.setPaintProperty(this.state.selectedState.shortName+'Borders', 'line-opacity', (this.state.showingDistricts)?1.0:0.25);
    map.setPaintProperty('districtBorders', 'line-opacity', (this.state.showingDistricts)?0.0:1.0)
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
          toggleConstitutionView={this.toggleConstitutionView}
          resetZoom={this.resetZoom}
          selectedState={this.state.selectedState}
          onStart={this.onStart}
          onToggle={this.onToggleAlgorithm}
          onStop={this.onStop}
          updateSettings={this.updateSettings}
        />
        <Modal
          className="Popup ConstitutionModal"
          overlayClassName="PopupOverlay"
          isOpen={this.state.constitution.isActive}
          onRequestClose={() => this.toggleConstitutionView()}
        >
          <ConstitutionModal constitution={this.state.constitution.text} />
        </Modal>
      </div>
    );
  }
}

export default Map;


