import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`#mapa{
    height:100%;
    width:100%;

  }`],
})
export class FullScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('FullScreenComponent.');
      const map = new mapboxgl.Map({
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-99.5900097607593,19.10019564977819],
      zoom: 17
    });
  }
}
