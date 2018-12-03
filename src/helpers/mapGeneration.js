import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../config/constants';

const IS_INTERACTIVE = false;
const URL_STYLE = 'mapbox://styles/longh/cjms2zdmpa7g52smzgtobl908';
const URL_STATES = 'mapbox://longh.0mfgysin';
const URL_WI = 'mapbox://longh.6h9vyqkw';
const DISTRICT_COUNT = 8;
const COLOR_RANGE = {
  RANGE_START: '#0a369d',
  RANGE_MID: '#FFFFFF',
  RANGE_END: '#bf0a30',
}

export const createMap = () => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
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
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  if(!map.isSourceLoaded(shortName+'Source')){
    map.addSource(shortName+'Source', {
      type: 'vector',
      url: URL_WI
    });
  }
  map.addLayer({
    'id': shortName+'Fill',
    'type': 'fill',
    'source': shortName+'Source',
    'source-layer': 'wisc',
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
    'source-layer': 'wisc',
    'layout': {},
    'paint': {
      'line-color': '#ffffff',
      'line-width': 0.5
    },
  });
  var hoveredStateId = null;
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: [shortName+'Fill']
    });
    if (hoveredStateId != null) setPrecinctDistrict(map, shortName, hoveredStateId, Math.random()*DISTRICT_COUNT);
    hoveredStateId = (features[0] != null) ? features[0].properties.GEOID10 : null;
  });
  map.on('sourcedata', function (e) {
    if (map.getSource(shortName+'Source') && map.isSourceLoaded(shortName+'Source')) {
      let precincts = map.querySourceFeatures(shortName+'Source', {
        sourceLayer: 'wisc',
      });
      for(let i = 0; i < precincts.length; i++) {
        map.setFeatureState(
          {
          source: shortName+'Source',
          sourceLayer: 'wisc',
          id: precincts[i].id
          },
          {
            districtID: Math.random()*DISTRICT_COUNT
          });
      }
      map.on('sourcedata', function (e) {});
    }
  });
}

export const unloadState = (map, shortName) => {
    map.removeLayer(shortName+'Fill');
    map.removeLayer(shortName+'Borders');
    map.removeSource(shortName+'Source');
}

export const setPrecinctDistrict = (map, stateShortName, precinctID, districtID) => {
  let precinct = map.querySourceFeatures(stateShortName+'Source', {
    sourceLayer: 'wisc',
    filter: ['in', 'GEOID10', precinctID]
  })[0];
  if(precinct !=  null){
    //console.log('setting precinct: ' + precinctID + ' to district: ' + districtID);
    map.setFeatureState(
    {
    source: stateShortName+'Source',
    sourceLayer: 'wisc',
    id: precinct.id
    },
    {
      districtID: districtID
    });
  }
}
