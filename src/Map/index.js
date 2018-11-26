import DisplayModal from './DisplayModal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';
import mapboxgl from 'mapbox-gl';

var map;

class Map extends Component {

    render() {
        return (
            <div>
                <div id='map'></div>
                <DisplayModal />
                <ToolModal />
            </div>
        );
    }
    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibG9uZ2giLCJhIjoiY2psem92M2JkMDN4bDNsbXlhZ2Z6ZzhoZiJ9.qEtkhzP-UwuKVkV5suN7sg';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/longh/cjms2zdmpa7g52smzgtobl908',
            center: [-95.7, 39],
            minZoom: 3.75,
            zoom: 3.75,
            interactive: false
        });
        map.on('load', function () {
            map.addSource('stateSource', {
                type: 'vector',
                url: 'mapbox://longh.0mfgysin'
            });
            map.addSource('wiscSource', {
                type: 'vector',
                url: 'mapbox://longh.6h9vyqkw'
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
                        '#880000',
                        '#000088'
                    ],
                    "fill-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        1.0,
                        0.5
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
                        '#880000',
                        '#000088'
                    ],
                    "fill-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        1.0,
                        0.5
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
                    'line-width': 2.0
                },
                'minzoom': 3.5,
                'maxzoom': 5.5
            });
            var hoveredStateId = null;
            map.on('mousemove', function (e) {
                var features = map.queryRenderedFeatures(e.point, { layers: ['stateFill'] });
                if (hoveredStateId != null) map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: hoveredStateId }, { hover: false });
                hoveredStateId = (features[0] != null)?features[0].id:null;
                map.setFeatureState({ source: 'stateSource', sourceLayer: 'usstates', id: hoveredStateId }, { hover: true });
            });
            map.on('mousedown', function(e){
                if (hoveredStateId != null){
                    fly();
                }
            });
        });
    }
}

export default Map;

function fly() {
  map.flyTo({center: [-89.36, 44.87], zoom: 6});
}

export const stateZoom = () => {
  fly();
}

export const resetZoom = () => {
  map.flyTo({center: [-95.7, 39], zoom: 3.75});
}
