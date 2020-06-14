import { Component, OnInit, OnDestroy } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { customMapLayers } from 'src/assets/customMapLayers';
import { BlockchainService } from 'src/app/services/blockchain.service';
// import { features } from 'process';
import { IGeoJson } from 'src/app/model/geoJSON';
import { Subscription } from 'rxjs';
import { features } from 'process';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  public map: mapboxgl.Map;
  public isMapLoaded = false;
  private peersFeatures: IGeoJson[] = [];
  private subscription = new Subscription();

  constructor(private blockchainService: BlockchainService) {

  }

  public ngOnInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-96, 37.8],
      zoom: 0
    });

    this.map.on('load', () => {
      this.map.resize();
      this.map.addSource('earthquakes',
      {
        type: 'geojson',
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 50,
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
      );

      navigator.geolocation.getCurrentPosition((position) => {
        const location = [+position.coords.longitude, +position.coords.latitude];
        this.map.flyTo({
          center: location,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        this.isMapLoaded = true;
      });


      const subscription = this.blockchainService.mapDataStream$.subscribe(peerGeoJson => {
        const alreadyAdded = this.peersFeatures.some(feature => feature.properties.url ===  peerGeoJson.properties.url);
        if (peerGeoJson && !alreadyAdded) {
          this.peersFeatures.push(peerGeoJson);
          this.map.getSource('earthquakes').setData({type: 'FeatureCollection', features: this.peersFeatures});
        }
      });

      this.subscription.add(subscription);

      customMapLayers.forEach(layer => {
        this.map.addLayer(layer);
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      this.map.on('mouseenter', 'unclustered-point', (e) => {
        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.url;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(coordinates)
          .setHTML(`<p>${description}<p>`)
          .addTo(this.map);
      });

      this.map.on('mouseleave', 'unclustered-point', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.map.resize();
  // }


  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

