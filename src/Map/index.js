import DisplayModal from './DisplayModal';
import Modal from 'react-modal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import { startAlgorithm, toggleAlgorithm, stopAlgorithm, getConstitution } from '../helpers/district-designer';
import { createMap, loadState, unloadState } from '../helpers/mapGeneration';
import ConstitutionModal from './ConstitutionModal';
import { MODAL } from '../config/constants';
import InfoModal from './InfoModal';
import StateSelector from './StateSelector';

let map;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomed: false,
      displayPane: MODAL.STATE_MODAL,
      selectedState: 'none',
      terminalUpdates: [],
      showingDistricts: false,
      constitution: {
        isActive: false,
        text: "",
      },
      hoveredStateId: null,
      hoveredStateName: null,
      hoveredPrecinctId: null,
    };
  }

  hoverState = (e) => {
    var features = map.queryRenderedFeatures(e.point, { layers: ['stateFill'] });
    if (this.state.hoveredStateId != null) map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: this.state.hoveredStateId }, { hover: false });
    this.setState({ hoveredStateId: (features[0] != null)?features[0].id:null });
    this.setState({ hoveredStateName: (features[0] != null)?features[0].properties.name:null} );
    map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: this.state.hoveredStateId }, { hover: true }); 
  }

  componentDidMount() {
    map = createMap();
    map.on('mousemove', (e) => this.hoverState(e));
    map.on('mousedown', (e) => {
      let usstate = (this.props.usstates).filter((stateEntry) => (stateEntry.label === this.state.hoveredStateName))[0];
      if (usstate !== undefined) {
        console.log(usstate.shortName);
        this.stateZoom(usstate);
      }
    });
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
      displayPane: MODAL.STATE_MODAL,
      selectedState: 'none',
    });
    this.enableHover(map, '', false);
    map.flyTo({center: [-95.7, 39], zoom: 3.75});
  }

  showAlgorithm = () => {
    this.setState({
      displayPane: MODAL.TOOL_MODAL,
    });
    this.enableHover(map, '', false);
  }

  hideAlgorithm = () => {
    this.toggleDistrictView(true);
    this.setState({
      displayPane: MODAL.INFO_MODAL,
    });
    this.enableHover(map, this.state.selectedState.shortName, true);
  }

  stateZoom = (usstate) => {
    this.setState({
      zoomed: true,
      displayPane: MODAL.INFO_MODAL,
      selectedState: usstate
    });
    loadState(map, usstate.shortName, usstate.id);
    this.enableHover(map, usstate.shortName, true);
    this.toggleDistrictView(true);
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

  toggleDistrictView = (show) => {
    this.setState({ showingDistricts: !show});
    this.enableHover(map, this.state.selectedState.shortName, !this.state.showingDistricts);
    map.setPaintProperty(this.state.selectedState.shortName+'Borders', 'line-opacity', (!show)?1.0:0.0);
    map.setPaintProperty(this.state.selectedState.shortName+'Fill', 'fill-opacity', (!show)?1.0:0.0);
    map.setPaintProperty('districtBorders', 'line-opacity', (!show)?0.0:1.0)
    map.setPaintProperty('districtFill', 'fill-opacity', (!show)?0.0:1.0)
  }

  onPrecinctHover = (e) => {
    var features = map.queryRenderedFeatures(e.point, { layers: [this.state.selectedState.shortName+'Fill'] });
    if (this.state.hoveredPrecinctId != null) map.setFeatureState({ source: [this.state.selectedState.shortName+'Source'], id: this.state.hoveredPrecinctId }, { hover: false });
    this.setState({hoveredPrecinctId: (features[0] != null)?features[0].id:null});
    map.setFeatureState({ source: this.state.selectedState.shortName+'Source', id: this.state.hoveredPrecinctId }, { hover: true });
  }

  enableHover = (map, shortName,  enable) => {
    if(enable) {
      map.on('mousemove', this.onPrecinctHover);
    } else {
      map.off('mousemove', this.onPrecinctHover);
      map.setFeatureState({ source: [this.state.selectedState.shortName+'Source'], id: this.state.hoveredPrecinctId }, { hover: false });
      this.setState({ hoveredPrecinctId: null });
    }
  }

  render() {
    return (
      <div>
        <div id='map'></div>
        {
          (this.state.displayPane === MODAL.TOOL_MODAL)?
          <DisplayModal
            zoomed={this.state.zoomed}
            terminalUpdates={this.state.terminalUpdates}
            clearOutput={this.clearOutput}
          />:<div/>
        }
        {
          (this.state.displayPane === MODAL.TOOL_MODAL)?
          <ToolModal
          zoomed={this.state.zoomed}
          stateZoom={this.stateZoom}
          resetZoom={this.hideAlgorithm}
          selectedState={this.state.selectedState}
          onStart={this.onStart}
          onToggle={this.onToggleAlgorithm}
          onStop={this.onStop}
          updateSettings={this.updateSettings}
          />:<div/>
        }
        {
          (this.state.displayPane === MODAL.INFO_MODAL)?
          <InfoModal
          resetZoom={this.resetZoom}
          showAlgorithm={this.showAlgorithm}
          toggleDistrictView={this.toggleDistrictView}
          toggleConstitutionView={this.toggleConstitutionView}
          />:<div/>
        }
        {
          (this.state.displayPane === MODAL.STATE_MODAL)?
          <div className="Modal ToolModal">
          <StateSelector
            stateZoom={this.stateZoom}
            resetZoom={this.resetZoom}
            usstates={this.props.usstates}
          />
          </div>:<div/>
        }
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

Map.defaultProps = {
  usstates: [
    {
      id: '45',
      shortName: 'SC',
      label: 'South Carolina',
      boundingBox: {
        center: [-81, 34],
        zoom: 6.5,
      },
    },
    {
      id: '49',
      shortName: 'UT',
      label: 'Utah',
      boundingBox: {
        center: [-112, 39],
        zoom: 5.5,
      },
    },
    {
      id: '55',
      shortName: 'WI',
      label: 'Wisconsin',
      boundingBox: {
        center: [-89.36, 44.87],
        zoom: 6,
      },
    },
  ]
};

export default Map;


