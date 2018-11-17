import { URL } from '../config/constants';

export const getUpdate = () => {
  console.log('Update received.')
  return true;
}

export const startAlgorithm = (weights, shortName, algoType) => {
  console.log("Algorithm Started: \nWeights: ", weights, "\nState: ", shortName, "\nAlgorithm Type:", algoType);
  return true;
}

export const stopAlgorithm = () => {
  console.log("Algorithm Stopped");
  return true;
}

export const pauseAlgirithm = () => {
  console.log("Algorithm Paused");  
  return true;
}
