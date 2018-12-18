import DisplayModal from './DisplayModal';
import Modal from 'react-modal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import InfoModal from './InfoModal';
import { startAlgorithm, toggleAlgorithm, stopAlgorithm, getConstitution } from '../helpers/district-designer';
import { createMap, loadState, unloadState } from '../helpers/mapGeneration';
import ConstitutionModal from './ConstitutionModal';
import { MODAL } from '../config/constants';
import StateSelector from './StateSelector';
import mapboxgl from 'mapbox-gl';

let map;
let popup_state;
let popup_precinct;

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
      mapMoving: false,
    };
  }

  hoverState = (e) => {
    var features = map.queryRenderedFeatures(e.point, { layers: ['stateFill'] });
    if (this.state.hoveredStateId != null) map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: this.state.hoveredStateId }, { hover: false });
    this.setState({ hoveredStateId: (features[0] != null)?features[0].id:null });
    this.setState({ hoveredStateName: (features[0] != null)?features[0].properties.name:null} );
    if (this.state.hoveredStateId != null) map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: this.state.hoveredStateId }, { hover: true }); 
    if(popup_state !== undefined) { popup_state.remove(); }
  }

  componentDidMount() {
    map = createMap();
    map['dragPan'].enable();
    map['scrollZoom'].enable();
    map.setMaxZoom(5.0);
    map.setMinZoom(2.0);
    map.on('mousemove', (e) => this.hoverState(e));
    map.on('click', (e) => {
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
    if(popup_precinct !== undefined) { popup_precinct.remove(); }
    unloadState(map, this.state.selectedState.shortName);
    this.setState({
      zoomed: false,
      displayPane: MODAL.STATE_MODAL,
      selectedState: 'none',
    });
    this.enableHover(map, '', false);
    map.once('moveend', function(){
      map.setMaxZoom(5.0);
    });
    map.setMinZoom(2.0);
    map.flyTo({center: [-95.7, 39], zoom: 3.75});
  }

  showAlgorithm = () => {
    map['dragPan'].disable();
    map['scrollZoom'].disable();
    map.flyTo(this.state.selectedState.boundingBox);
    if(popup_precinct !== undefined) { popup_precinct.remove(); }
    this.setState({
      displayPane: MODAL.TOOL_MODAL,
    });
    this.enableHover(map, '', false);
  }

  hideAlgorithm = () => {
    this.toggleDistrictView(true);
    map['dragPan'].enable();
    map['scrollZoom'].enable();
    this.setState({
      displayPane: MODAL.INFO_MODAL,
    });
    this.enableHover(map, this.state.selectedState.shortName, true);
  }

  stateZoom = (usstate) => {
    if(popup_state !== undefined) { popup_state.remove(); }
    this.setState({
      zoomed: true,
      selectedState: usstate,
      displayPane: MODAL.INFO_MODAL,
    });
    loadState(map, usstate.shortName, usstate.id);
    this.enableHover(map, usstate.shortName, true);
    this.toggleDistrictView(true);
    map.once('moveend', function(){
      map.setMinZoom(5.5);
    });
    map.setMaxZoom(10.0);
    map.flyTo(usstate.boundingBox);
    map['dragPan'].enable();
    map['scrollZoom'].enable();
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
    if(popup_precinct !== undefined) { popup_precinct.remove(); }
    this.setState({ showingDistricts: !show});
    this.enableHover(map, this.state.selectedState.shortName, !this.state.showingDistricts);
    map.setPaintProperty(this.state.selectedState.shortName+'Borders', 'line-opacity', (!show)?1.0:1.0);
    map.setPaintProperty(this.state.selectedState.shortName+'Fill', 'fill-opacity', (!show)?1.0:1.0);
    map.setPaintProperty('districtBorders', 'line-opacity', (!show)?0.0:1.0)
    map.setPaintProperty('districtFill', 'fill-opacity', (!show)?0.0:1.0)
  }

  onPrecinctHover = (e) => {
    var features = map.queryRenderedFeatures(e.point, { layers: [this.state.selectedState.shortName+'Fill'] });
    
    this.setState({hoveredPrecinctId: (features[0] != null)?features[0].id:null});
    if(popup_precinct !== undefined) { popup_precinct.remove(); }
    if(this.state.hoveredPrecinctId !== null && this.state.displayPane === MODAL.INFO_MODAL && this.state.showingDistricts) {
      let textOut = '';
      Object.keys(features[0].properties).map((key)=>(textOut += key+': '+features[0].properties[key] + '<br/>'));
      popup_precinct = new mapboxgl.Popup({closeButton: false, closeOnClick: false})
      .setLngLat(e.lngLat)
      .setHTML('<p>'+textOut+'</p>')
      .addTo(map);
    }
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
          toggleDistrictView={this.toggleDistrictView}
          toggleConstitutionView={this.toggleConstitutionView}
          resetZoom={this.hideAlgorithm}
          selectedState={this.state.selectedState}
          onStart={this.onStart}
          onToggle={this.onToggleAlgorithm}
          onStop={this.onStop}
          updateSettings={this.updateSettings}
          user={this.props.user}
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


