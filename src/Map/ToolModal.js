import React, { Component } from 'react';
import Slider from 'rc-slider';
import StateSelector from "./StateSelector"
import 'rc-slider/assets/index.css';
import ParameterSelector from './ParameterSelector';
import { getConstitution, saveWeights, loadWeights } from '../helpers/district-designer';
import Alert from 'react-s-alert';
import Select from 'react-select';
import { ALGORITHM_STATE } from '../config/constants';

class ToolModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      saving: false,
      weights: this.props.weights,
      weightsName: '',
      algorithm: this.props.algorithms[0].value,
      algorithmState: ALGORITHM_STATE.STOPPED,
      parameters: {},
      options: [],
      weightOptionsList: [],
      runCount: 0,
      weightsToSend: [],
    };
  }

  componentDidMount() {
    this.props.weights.map((item) => (this.initWeight(item.id, (this.props.sliderMax/2).toFixed(2))));
  }

  toggleConstitutionView = () => {
    const shortName = this.props.selectedState.shortName;
    const constitutionText = getConstitution(shortName);
    this.props.toggleConstitutionView(constitutionText);
  }

  onToggle = (toggle) => {
    this.props.onToggle(toggle);
    if(toggle) {
      this.requestLoop();
    }
  }

  onStart = () => {
    let started = this.props.onStart(this.state.weights, this.state.algorithm, this.state.parameters);
    this.setState({ algorithmState: (started)?ALGORITHM_STATE.RUNNING:ALGORITHM_STATE.STOPPED });
    this.requestLoop();
  }
  
  onStop = () => {
    this.props.onStop();
  }

  onUpdate = () => {
    console.log(this.state.runCount);
    this.setState({ runCount: this.state.runCount + 1 });
    return this.state.runCount < 50;
  }

  requestLoop = () => {
    let continueAlgorithm = true;
    while(!(this.state.algorithmState===ALGORITHM_STATE.PAUSED) && continueAlgorithm) {
      continueAlgorithm = this.onUpdate();
    }
  }

  updateAlgorithm = (value) => {
    this.setState({ algorithm: value});
  }

  updateParameters = (parameters) => {
    this.setState({ parameters: parameters });
  }

  initWeight = (sliderId, newWeight) => {
    let newWeightsToSend = [];
    this.props.weights.map(element => {
      newWeightsToSend.push({
        id: element.startId,
        value: (newWeight / this.props.sliderMax).toFixed(2),
      });
    });
    this.setState({ weightsToSend: newWeightsToSend });
  }

  updateWeight = (sliderId, newWeight) => {
    let newWeights = [];
    let newWeightsToSend = [];
    this.state.weights.map(element => {
      if (element.id === sliderId) {
        newWeights.push({
          id: element.id,
          startId: element.startId,
          value: (newWeight / this.props.sliderMax).toFixed(2),
        });
        newWeightsToSend.push({
          id: element.startId,
          value: (newWeight / this.props.sliderMax).toFixed(2),
        });
      } else {
        newWeights.push({
          id: element.id,
          startId: element.startId,
          value: element.value,
        });
        newWeightsToSend.push({
          id: element.startId,
          value: element.value,
        });
      }
    });
    this.setState({ weights: newWeights });
    this.setState({ weightsToSend: newWeightsToSend });
  }

  zoomOut = () => {
    this.props.resetZoom();
  }

  success = (mess) => {
    Alert.success(mess, {
      position: 'bottom-left',
      effect: 'scale',
      timeout: 1000,
      offset: 20
    });
  }

  saveWeightsName = (e) => {
    this.setState({ weightsName: e.target.value });
  }

  saveWeights = () => {
    let weights = {};
    this.state.weights.map((w)=>{weights[w.id] = w.value;return 0;});
    weights.username = this.props.user.username;
    weights.name = this.state.weightsName;
    saveWeights(weights);
    this.setState({saving: !this.state.saving})
    this.success('Saved Weights');
  }

  loadWeights = () => {
    this.success('Fetching Weights');
    let loadedWeights = loadWeights(this.props.user.username)
    let optionsArray = [];
    loadedWeights.map((w)=>{
      optionsArray.push(
        { 
          label: w.name,
          value: [
            {
              label: 'Compactness',
              id: 'compactness',
              value: w.compactness,
            },
            {
              label: 'Partisan Gerrymandering',
              id: 'partisan_Gerrymandering',
              value: w.partisanGerrymandering,
            },
            {
              label: 'Population Equality',
              id: 'population_Equality',
              value: w.populationEquality,
            },
          ],
        },
      );
      return 0;
    });
    this.setState({ weightOptionsList: optionsArray });
  }

  setWeights = (v) => {
    let out = '';
    Object.keys(v.value).map((k)=>{
      out+=k+', '+v.value[k];
      return 0;
    });
    console.log(out);
    this.setState({ weights: v.value });
    this.success('Updated Weights');
  }

  render() {
    if(this.props.zoomed === true){
      let parameters = this.props.algorithms.filter((a) => (a.value === this.state.algorithm))[0].parameters;
      return (
        <div className="Modal ToolModal">
        <button onClick={() => this.zoomOut()} disabled={!(this.state.algorithmState===ALGORITHM_STATE.STOPPED)}>← Return to Demographics View</button>
        <div className="scrollable inset"> 
          {
            ((this.state.algorithmState===ALGORITHM_STATE.STOPPED) && this.props.user.isLoggedIn !== false)?
            <div className="weightSaveContainer">
              <Select
                className='react-select-container'
                classNamePrefix="react-select"
                placeholder="Load Weights"
                options={this.state.weightOptionsList}
                onMenuOpen={this.loadWeights}
                onChange={this.setWeights}
              />
              <button onClick={()=>this.setState({saving: !this.state.saving})}>{(this.state.saving)?'Cancel':'Save Weights'}</button>
              {(this.state.saving)?
              <div className="weightButtonContainer">
                <input type='text' onChange={(v)=>this.saveWeightsName(v)}/>
                <button onClick={()=>this.saveWeights()}>Save</button>
              </div>:<div/>}
            </div>:<div/>
          }
          {
            this.props.algorithms.map((item) => (
                <div key={item.value + 'Container'}>
                  <div className="weightContainer">
                    <input 
                      defaultChecked={item.value===this.state.algorithm} 
                      id={item.value} 
                      name="algorithmRadio" 
                      onClick={() => {this.updateAlgorithm(item.value)}}
                      type="radio"
                      disabled={!(this.state.algorithmState===ALGORITHM_STATE.STOPPED)}
                    />
                    <span className="radio"></span>
                    <label name={"algorithmTitle"}>{item.label}</label>
                  </div>
                </div>
            ))
          }
          {(parameters !== undefined)?
          <ParameterSelector
            parameters={parameters}
            updateParameters={this.updateParameters}
            isAlgorithmRunning={!(this.state.algorithmState===ALGORITHM_STATE.STOPPED)}
          />:<div/>}
          {
            this.props.weights.map((item) => (
                <div key={item.id + 'Container'}>
                  <label name={"weightTitle"}>{item.label}</label>
                  <div className="weightContainer">
                    <Slider
                      defaultValue={
                        parseFloat(item.value, 10)*(this.props.sliderMax)
                      }
                      value={
                        this.state.weights
                        .filter(weight => weight.id === item.id)
                        .map((weight) => {return (parseFloat(weight.value, 10)*(this.props.sliderMax))})
                      }
                      id={"weightSlider"+item.id} 
                      max={this.props.sliderMax} 
                      min={0} 
                      onChange={(value) => {this.updateWeight(item.id, value)}}
                      disabled={!(this.state.algorithmState === ALGORITHM_STATE.STOPPED)}
                    />
                    <label id={"weightLabel"+item.id}>
                      {
                        this.state.weights
                        .filter(weight => weight.id === item.id)
                        .map((weight) => {return parseFloat(weight.value, 10).toFixed(2)})
                      }
                    </label>
                  </div>
                </div>
            ))
          }
          </div>
          {
            (this.state.algorithmState===ALGORITHM_STATE.STOPPED)
            ?
            <button className='primaryButton' onClick={() => {
              this.onStart();
            }}>Start Algorithm</button>
            :<div/>
          }
          {
            (this.state.algorithmState===ALGORITHM_STATE.RUNNING)
            ?
            <div className="buttonContainer">
              <button onClick={() => {
                this.setState({ algorithmState: ALGORITHM_STATE.PAUSED });
                this.onToggle(false)
              }}>
                Pause
              </button>
              <button onClick={() => {
                this.setState({ algorithmState: ALGORITHM_STATE.STOPPED });
                this.onStop()
              }}>
                Stop
              </button>
            </div>
            :<div/>
            
          }
          {
            (this.state.algorithmState===ALGORITHM_STATE.PAUSED)
            ?
            <div className="buttonContainer">
              <button onClick={() => {
                this.setState({ algorithmState: ALGORITHM_STATE.RUNNING });
                this.onToggle(true)
              }}>
                Resume
              </button>
              <button onClick={() => {
                this.setState({ algorithmState: ALGORITHM_STATE.STOPPED });
                this.onStop()
              }}>
                Stop
              </button>
            </div>
            :<div/>
            
          }
          
        </div>
      );
    }
    else {
      return (
        <div className="Modal ToolModal">
          <StateSelector
            stateZoom={this.props.stateZoom}
            resetZoom={this.props.resetZoom}
          />
        </div>
      );
    }
  }
}

ToolModal.defaultProps = {
  algorithms: [
    {
      label: 'Region Growing',
      value: 'REGION_GROWING',
      parameters: [
        'seedSelect',
        'districtCount',
        'moveSelect',
      ],
    },
    {
      label: 'Simulated Annealing',
      value: 'SIMULATED_ANNEALING',
      parameters: [
        'moveSelect',
      ],
    },
  ],
  weights: [
    {
      label: 'Compactness',
      id: 'compactness',
      startId: 'compactness',
      value: 0.50,
    },
    {
      label: 'Partisan Gerrymandering',
      id: 'partisan_Gerrymandering',
      startId: 'partisan_Gerrymandering',
      value: 0.50,
    },
    {
      label: 'Population Equality',
      id: 'population_Equality',
      startId: 'population_Equality',
      value: 0.50,
    },
  ],
  sliderMax: 20,
};

export default ToolModal;
