export interface IGeoJson {
    type: 'Feature';
    geometry: {
      type: 'Point',
      coordinates: number[]
    };
    properties: {
      url: string
    };
}
