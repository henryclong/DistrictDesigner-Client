import { URL, HTTP_STATE, HTTP_STATUS } from '../config/constants';

export const getConstitution = (shortName) => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("GET", URL + "/Constitution?shortName=" + shortName, false);
  request.send();
  return request.onreadystatechange();
}

export const getUpdate = () => {
  console.log('Update received.');
  return true;
}

export const startAlgorithm = (algoType, shortName, weights) => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify({
    'algoType': algoType,
    'shortName': shortName,
    'weights': weights,
  });
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("POST", URL + "/StartAlgorithm", false);
  try{
    request.send(body);
  } catch (e) {
    return false;
  }
  return request.onreadystatechange();
}

export const stopAlgorithm = () => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }

  request.open("GET", URL + "/StopAlgorithm", false);
  request.send();
  return request.onreadystatechange();
}

export const toggleAlgorithm = (status) => {
  console.log("Algorithm Paused");  
  return true;
}
