import mapboxgl from 'mapbox-gl';

const ACCESS_TOKEN = 'pk.eyJ1IjoibG9uZ2giLCJhIjoiY2psem92M2JkMDN4bDNsbXlhZ2Z6ZzhoZiJ9.qEtkhzP-UwuKVkV5suN7sg';
const IS_INTERACTIVE = false;
const URL_STYLE = 'mapbox://styles/longh/cjms2zdmpa7g52smzgtobl908';
const URL_STATES = 'mapbox://longh.0mfgysin';
const URL_WI = 'mapbox://longh.6h9vyqkw';

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
    map.addSource('wiscSource', {
      type: 'vector',
      url: URL_WI
    });
    map.addLayer({
      'id': 'wiscFill',
      'type': 'fill',
      'source': 'wiscSource',
      'source-layer': 'wisc',
      'layout': {},
      'paint': {
        'fill-color': ["case",
          ["boolean", ["feature-state", "hover"], false],
          '#bf0a30',
          '#0a369d'
        ],
        "fill-opacity": ["case",
          ["boolean", ["feature-state", "hover"], false],
          1.0,
          0.8
        ]
      },
      'minzoom': 5.5,
      'maxzoom': 10
    });
    map.addLayer({
      'id': 'wiscBorders',
      'type': 'line',
      'source': 'wiscSource',
      'source-layer': 'wisc',
      'layout': {},
      'paint': {
        'line-color': '#ffffff',
        'line-width': 0.5
      },
      'minzoom': 5.5,
      'maxzoom': 10
    });
    map.addLayer({
      'id': 'stateFill',
      'type': 'fill',
      'source': 'stateSource',
      'source-layer': 'usstates',
      'layout': {},
      'paint': {
        'fill-color': ["case",
          ["boolean", ["feature-state", "hover"], false],
          '#0a369d',
          '#0a369d'
        ],
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
    var hoveredStateId = null;
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['stateFill']
      });
      if (hoveredStateId != null) map.setFeatureState({
        source: 'stateSource',
        sourceLayer: 'usstates',
        id: hoveredStateId
      }, {
        hover: false
      });
      hoveredStateId = (features[0] != null) ? features[0].id : null;
      map.setFeatureState({
        source: 'stateSource',
        sourceLayer: 'usstates',
        id: hoveredStateId
      }, {
        hover: true
      });
    });
  });
  return map;
}

export const addLayer = (map) => {

}
