export const convertToGEOJSON = (region) => {
  const geojsonFormat = {}
  if (region.hasOwnProperty('DISTRICTS')) {
    let i = 0;
    geojsonFormat['districts'] = {
      'type' : 'FeatureCollection',
      'features' : region['DISTRICTS'].map( district => (
        { 
          'type': 'Feature',
          ...district, 
          'properties': {
            id: i++,
          }
        }
        )),
    };
  }
  if (region.hasOwnProperty('PRECINCTS')) {
    geojsonFormat['precincts'] = {
      'type' : 'FeatureCollection',
      'features' : region['PRECINCTS'].map( precincts => (
        { 
          'type': 'Feature',
          ...precincts 
        }))
    };
  }

  return geojsonFormat;
}

export const readAsGEOJSON = (region) => {
  const geojsonfile = JSON.stringify(region).replace(/\\/g, '').replace(/"{/g, '{').replace(/}"/g, '}');
  console.log(geojsonfile);
  return geojsonfile;
}
