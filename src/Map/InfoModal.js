import React, { Component } from 'react';
import { getConstitution } from '../helpers/district-designer';

class InfoModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      showingDistricts: true,
    };
  }

  zoomOut = () => {
    this.props.toggleDistrictView(false);
    this.props.resetZoom();
  }

  goToAlgorithm = () => {
    this.props.toggleDistrictView(false);
    this.props.showAlgorithm();
  }

  toggleConstitutionView = () => {
    const shortName = this.props.selectedState.shortName;
    const constitutionText = getConstitution(shortName);
    this.props.toggleConstitutionView(constitutionText);
  }

  toggleDistrictView = (show) => {
    this.props.toggleDistrictView(show);
    this.setState({ showingDistricts: show });
  }

  render() {
    return (
    <div className="Modal ToolModal">
      <button onClick={() => this.zoomOut()}>← Return to State Select</button>
      <button onClick={() => this.props.toggleConstitutionView()}>Show State Constitution</button>
      <button onClick={() => this.toggleDistrictView(!this.state.showingDistricts)}>{(this.state.showingDistricts)?'Show Precincts':'Show Districts'}</button>
      <button onClick={() => this.goToAlgorithm()}>Continue to Algorithm Options →</button>
    </div>);
  }
}

export default InfoModal;
