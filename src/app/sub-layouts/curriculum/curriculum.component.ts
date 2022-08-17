import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  { path: 'batches', title: 'Batches', icon: 'book', class: '', children: [] },
  { path: 'courses', title: 'Courses', icon: 'book', class: '', children: [] },
  { path: 'co-mapping', title: 'Mapped CO\'s with PO\'s and PSO\'s ', icon: 'map', class: '', children: [] },
];

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {

  menuItems: RouteInfo[] | undefined;

  constructor() { }

  ngOnInit(): void {
    this.menuItems = ROUTES.map(e => e);
  }

}
