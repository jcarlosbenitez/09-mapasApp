import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }
      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 999;
        width: 400px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  longitudLatitud: [number, number] = [-99.59001878259863, 19.100170074273898];
  constructor() {
    console.log('divMApa constructor', this.divMapa);
  }
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    console.log('divMApa', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.longitudLatitud, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
      //  console.log("zoom", zoomActual)
    });

    this.mapa.on('zoomend', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
      //  console.log("zoom", zoomActual)
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });

    this.mapa.on('move', (event) => {
      const target = event.target;

      const { lat, lng } = target.getCenter();
      this.longitudLatitud = [lat, lng];
    });
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
    console.log(valor);
  }

  zoomOut() {
    console.log('divMApa out', this.divMapa);
    this.mapa.zoomOut();
  }
}
