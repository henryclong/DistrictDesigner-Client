import mapboxgl from 'mapbox-gl';

const ACCESS_TOKEN = 'pk.eyJ1IjoibG9uZ2giLCJhIjoiY2psem92M2JkMDN4bDNsbXlhZ2Z6ZzhoZiJ9.qEtkhzP-UwuKVkV5suN7sg';
const IS_INTERACTIVE = false;
const URL_STYLE = 'mapbox://styles/longh/cjms2zdmpa7g52smzgtobl908';
const URL_STATES = 'mapbox://longh.0mfgysin';
const DISTRICT_COUNT = 8;
const COLOR_RANGE = {
  RANGE_START: '#0a369d',
  RANGE_MID: '#FFFFFF',
  RANGE_END: '#bf0a30',
}

export const createMap = () => {
  mapboxgl.accessToken = ACCESS_TOKEN;
  let map = new mapboxgl.Map({
    container: 'map',
    style: URL_STYLE,
    center: [-95.7, 39],
    minZoom: 3.75,
    zoom: 3.75,
    interactive: IS_INTERACTIVE,
  });
  map.on('load', function () {
    map.addSource('stateSource', {
      type: 'vector',
      url: URL_STATES
    });
    map.addLayer({
      'id': 'stateFill',
      'type': 'fill',
      'source': 'stateSource',
      'source-layer': 'usstates',
      'layout': {},
      'paint': {
        'fill-color': '#0a369d',
        "fill-opacity": ["case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.7
        ]
      },
      'minzoom': 3.5,
      'maxzoom': 5.5
    });
    map.addLayer({
      'id': 'stateBorders',
      'type': 'line',
      'source': 'stateSource',
      'source-layer': 'usstates',
      'layout': {},
      'paint': {
        'line-color': '#ffffff',
        'line-width': 1.5
      },
      'minzoom': 3.5,
      'maxzoom': 5.5
    });
  });
  return map;
}

export const loadState = (map, shortName) => {
  let initStateMap = () => {
    if (map.getSource(shortName+'Source') && map.isSourceLoaded(shortName+'Source', {
      filter: ['has', 'id']
    }) && map.areTilesLoaded()) {
      let precincts = map.querySourceFeatures(shortName+'Source');
      console.log('precinct_count='+precincts.length);
      for(let i = 0; i < precincts.length; i++) {
        if(i%100 === 0) console.log('count='+i);
        setPrecinctDistrict(map, shortName, precincts[i].properties.GEOID10, 0);
      }
      map.off('sourcedata', initStateMap);
    }
  }
  if(!(map.isSourceLoaded(shortName+'Source'))){
    map.on('sourcedata', initStateMap);
    map.addSource(shortName+'Source', {
      type: 'geojson',
      data: '/' + shortName.toLowerCase() + '_with_id.json'
    });
  }
  map.addLayer({
    'id': shortName+'Fill',
    'type': 'fill',
    'source': shortName+'Source',
    'layout': {},
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'districtID'],
        0, COLOR_RANGE.RANGE_START,
        DISTRICT_COUNT, COLOR_RANGE.RANGE_END,
      ],
      "fill-opacity": ["case",
        ["boolean", ["feature-state", "hover"], false],
        1.0,
        0.8
      ]
    },
  });
  map.addLayer({
    'id': shortName+'Borders',
    'type': 'line',
    'source': shortName+'Source',
    'layout': {},
    'paint': {
      'line-color': '#ffffff',
      'line-width': 0.5
    },
  });
}

export const unloadState = (map, shortName) => {
    map.removeLayer(shortName+'Fill');
    map.removeLayer(shortName+'Borders');
}

export const setPrecinctDistrict = (map, stateShortName, precinctID, districtID) => {
  map.setFeatureState(
  {
    source: stateShortName+'Source',
    id: precinctID
  },
  {
    districtID: districtID
  });
}
