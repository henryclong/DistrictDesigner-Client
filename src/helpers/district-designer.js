import { URL } from '../config/constants';

export const getUpdate = () => {
  console.log('Update received.')
  return true;
}

export const startAlgorithm = (weights, shortName, algoType) => {
  console.log("Algorithm Started: \nWeights: ", weights, "\nState: ", shortName, "\nAlgorithm Type:", algoType);
  appendOutput('algorithm started');
  return true;
}

export const stopAlgorithm = () => {
  console.log("Algorithm Stopped");
  appendOutput('algorithm stopped');
  return true;
}

export const pauseAlgirithm = () => {
  console.log("Algorithm Paused");  
  appendOutput('algorithm paused');
  return true;
}

export const clearOutput = () => {
  document.getElementById('outputTextArea').innerHTML = '';
}

export const appendOutput = (text) => {
  let currentText = document.getElementById('outputTextArea').innerHTML;
  document.getElementById('outputTextArea').innerHTML = (currentText += (text += '<br>'));
}
