import { URL, HTTP_STATE, HTTP_STATUS } from '../config/constants';
import { generatePassword, validateAuth } from './utils';
import { convertToGEOJSON } from './geojsonConverter';

let sessionId = '';

export const createAccount = (username, password) => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify({
    'username': username,
    'password': generatePassword(password),
  });
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("POST", URL + "/CreateAccount", false);
  try{
    request.send(body);
  } catch (e) {
    return false;
  }
  return request.onreadystatechange();
}

export const authUser = (username, password) => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify({
    'username': username,
    'password': '',
  });
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("POST", URL + "/LogIn", false);
  try{
    request.send(body);
  } catch (e) {
    return false;
  }
  return validateAuth(password, request.onreadystatechange());
}

export const logOut = () => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("GET", URL + "/LogOut", false);
  try{
    request.send();
  } catch (e) {
    return false;
  }
  return request.onreadystatechange();
}

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

export const getOriginalMapData = (shortName) => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return convertToGEOJSON(JSON.parse(request.response));
    }
  }
  request.open("GET", URL + "/OriginalMapData?shortName=" + shortName, false);
  request.send();
  return request.onreadystatechange();
}

export const getPopulationInfo = (shortName) => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("GET", URL + "/PopulationInfo?shortName=" + shortName, false);
  request.send();
  return request.onreadystatechange();
}

export const getUpdate = () => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify({
    'sessionId': sessionId,
  });
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("POST", URL + "/UpdatePrecincts", false);
  request.send(body);
  return request.onreadystatechange();
}

export const startAlgorithm = (algoType, shortName, weights, parameters) => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify({
    'algoType': algoType,
    'shortName': shortName,
    'weights': weights,
    'parameters': parameters,
  });
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      const responseBody = JSON.parse(request.response);
      sessionId = responseBody['SESSION_ID'];
      return responseBody;
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

export const saveWeights = (weights) => {
  const request = new XMLHttpRequest();
  const body = JSON.stringify(weights);
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("POST", URL + "/SaveWeights", false);
  try{
    request.send(body);
  } catch (e) { return false; }
  return request.onreadystatechange();
}

export const loadWeights = (username) => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === HTTP_STATE.DONE && request.status === HTTP_STATUS.OK) {
      return JSON.parse(request.response);
    }
  }
  request.open("GET", URL + "/LoadWeights?username="+username, false);
  try{
    request.send();
  } catch (e) { return false; }
  return request.onreadystatechange();
}
