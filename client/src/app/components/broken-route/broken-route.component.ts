import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-broken-route',
  standalone: false,

  templateUrl: './broken-route.component.html',
  styleUrl: './broken-route.component.scss',
})
export class BrokenRouteComponent {
  constructor(private router: Router, private location: Location) {}

  goBack() {
    this.location.back();
  }
}
