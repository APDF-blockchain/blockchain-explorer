import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map: mapboxgl.Map;

  constructor() {

  }

  public ngOnInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.585071, 45.4696563],
      zoom: 8
    });
    var size = 200;
 
    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
    var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    
    // get rendering context for the map canvas when layer is added to the map
    onAdd: function() {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },
    
    // called once before every frame where the icon will be used
    render: function() {
    var duration = 1000;
    var t = (performance.now() % duration) / duration;
    
    var radius = (size / 2) * 0.3;
    var outerRadius = (size / 2) * 0.7 * t + radius;
    var context = this.context;
    
    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    outerRadius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
    context.fill();
    
    // draw inner circle
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    radius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
    
    // update this image's data with data from the canvas
    this.data = context.getImageData(
    0,
    0,
    this.width,
    this.height
    ).data;
    
    // continuously repaint the map, resulting in the smooth animation of the dot
    if (this.map) {
      this.map.triggerRepaint();
    }
    
    // return `true` to let the map know that the image was updated
    return true;
    }
    }

    this.map.on('load', () => {
      this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      
      this.map.addSource('points',
        {
            'type': 'geojson',
            'data': {
            'type': 'FeatureCollection',
            'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [-73.585071, 45.4696563]
              }
            }
            ]
          }
        }
      );

      this.map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
        'icon-image': 'pulsing-dot'
      }
      });
    });
  }

}

