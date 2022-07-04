import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}
@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  longitudLatitud: [number, number] = [-99.59001878259863, 19.100170074273898];
  //arreglo marcadores

  marcadores: MarcadorColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    console.log('divMApa', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.longitudLatitud, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.leerLocalStorage();
    //   const markerHtml: HTMLElement = document.createElement('div');
    //   markerHtml.innerHTML = 'Hola Mundo';
    //   new mapboxgl.Marker({
    //     element: markerHtml,
    //   })
    //     .setLngLat(this.longitudLatitud)
    //     .addTo(this.mapa);
    // }
  }

  agregarMarcador() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    console.log('color', color);
    const nuevoMarcardor = new mapboxgl.Marker({
      draggable: true,
      color,
    })
      .setLngLat(this.longitudLatitud)
      .addTo(this.mapa);

    this.marcadores.push({ color, marker: nuevoMarcardor });
    console.log(this.marcadores);
    nuevoMarcardor.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
      console.log('drag');
    });
  }

  irMarcador(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat(),
    });
  }
  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({ color, centro: [lng, lat] });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage() {
    if (!localStorage) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );
    console.log(lngLatArr);
    lngLatArr.forEach((m) => {
      const newMarcador = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);
      this.marcadores.push({ marker: newMarcador, color: m.color });
      newMarcador.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
        console.log('drag');
      });
    });
  }
  borrarMarcador(i: number) {
    console.log(i);
    this.marcadores[i].marker?.remove();

    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
