import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE_URL, STATE_OUTLINE_URL } from '../config/constants';
const DISTRICT_COUNT = 8;

export const createMap = () => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  let map = new mapboxgl.Map({
    container: 'map',
    style: MAPBOX_STYLE_URL,
    center: [-95.7, 39],
    minZoom: 3.75,
    zoom: 3.75,
    interactive: false,
  });
  map.on('load', function () {
    map.addSource('stateSource', {
      type: 'vector',
      url: STATE_OUTLINE_URL,
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
    map.addSource('districtSource', {
      type: 'geojson',
      data: '/us_districts.json',
    });
    /*map.addLayer({
      'id': 'districtBorders',
      'type': 'line',
      'source': 'districtSource',
      'paint': {
        'line-color': '#800000',
        'line-width': 2.0
      }
    });*/
  });
  return map;
}

export const loadState = (map, shortName) => {
  let initStateMap = () => {
    if (map.getSource(shortName+'Source') && map.isSourceLoaded(shortName+'Source', {
      filter: ['has', 'id']
    }) && map.areTilesLoaded()) {
      let precincts = map.querySourceFeatures(shortName+'Source');
      for(let i = 0; i < precincts.length; i++) {
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
        0, '#0a369d',
        DISTRICT_COUNT, '#bf0a30',
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
