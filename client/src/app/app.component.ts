import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticatorService } from './services/authenticator.service/authenticator.service';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isMobile = false;

  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthenticatorService,
    private platform: Platform,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    // Check if it's a real mobile device
    this.isMobile = this.platform.ANDROID || this.platform.IOS;

    // Also check if the screen width is in mobile range
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches; // Automatically update on resize
        this.cdr.detectChanges(); // 👈 Force UI update when screen size changes
      });
  }

  ngOnInit(): void {
    // Listen to route changes
    this.authService.checkTokenAge();
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
