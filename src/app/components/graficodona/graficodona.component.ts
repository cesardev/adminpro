import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graficodona',
  templateUrl: './graficodona.component.html',
  styles: []
})
export class GraficodonaComponent implements OnInit {

  @Input() datos: number[];
  @Input() etiquetas: string[];
  @Input() tipo: string;

  constructor() { }

  ngOnInit() {
  }

}
