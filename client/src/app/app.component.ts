import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title, private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd) // Only listen to navigation events
      )
      .subscribe(() => {
        // Logic to determine title based on the route
        const routeTitle = this.getTitleFromRoute(
          this.router.routerState.snapshot.root
        );
        this.titleService.setTitle(routeTitle);
      });
  }

  // Helper function to recursively get the title from route data
  private getTitleFromRoute(routeSnapshot: any): string {
    let title =
      routeSnapshot.data && routeSnapshot.data['title']
        ? routeSnapshot.data['title']
        : 'Default Title';
    if (routeSnapshot.firstChild) {
      title = this.getTitleFromRoute(routeSnapshot.firstChild) || title;
    }
    return title;
  }
}
