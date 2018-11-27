import { URL } from '../config/constants';

export const getUpdate = () => {
  console.log('Update received.')
  return true;
}

export const startAlgorithm = (weights, shortName, algoType) => {
  console.log("Algorithm Started: \nWeights: ", weights, "\nState: ", shortName, "\nAlgorithm Type:", algoType);
  appendOutput("Algorithm Started:<br>Weights: " + weights + "<br>State: " + shortName + "<br>Algorithm Type: " + algoType);
  return true;
}

export const stopAlgorithm = () => {
  console.log("Algorithm Stopped");
  appendOutput('Algorithm Stopped');
  return true;
}

export const pauseAlgorithm = () => {
  console.log("Algorithm Paused");  
  appendOutput('Algorithm Paused');
  return true;
}

export const clearOutput = () => {
  let outputTextArea = document.getElementById('outputTextArea');
  if(outputTextArea != null){
    outputTextArea.innerHTML = '';
  }
}

export const appendOutput = (text) => {
  let currentText = document.getElementById('outputTextArea').innerHTML;
  let outputTextArea = document.getElementById('outputTextArea');
  outputTextArea.innerHTML = (currentText += (text += '<br><br>'));
  outputTextArea.scrollTop = outputTextArea.scrollHeight;
}
