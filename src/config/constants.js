export const URL = process.env.REACT_APP_DISCTRICT_DESIGNER_SERVER_URL;
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibG9uZ2giLCJhIjoiY2psem92M2JkMDN4bDNsbXlhZ2Z6ZzhoZiJ9.qEtkhzP-UwuKVkV5suN7sg';
export const MAPBOX_STYLE_URL = 'mapbox://styles/longh/cjms2zdmpa7g52smzgtobl908';
export const STATE_OUTLINE_URL = 'mapbox://longh.0mfgysin';

export const SALT_ROUNDS = 10

export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
};

export const HTTP_STATE = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
}

export const MODAL = {
  STATE_MODAL: 0,
  INFO_MODAL: 1,
  TOOL_MODAL: 2,
}

export const ALGORITHM_STATE = {
  STOPPED: 0,
  RUNNING: 1,
  PAUSED:2,
}
