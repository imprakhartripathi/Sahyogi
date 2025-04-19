// theme.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorTheme } from '../../components/subcomponents/settings/settings.component';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: ColorTheme = ColorTheme.System;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme(): void {
    const savedTheme =
      (localStorage.getItem('theme') as ColorTheme) || ColorTheme.System;
    this.setTheme(savedTheme);
  }

  setTheme(theme: ColorTheme): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const html = document.documentElement;

    this.renderer.removeClass(html, 'light-theme');
    this.renderer.removeClass(html, 'dark-theme');

    if (theme === ColorTheme.System) {
      this.renderer.addClass(html, prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      this.renderer.addClass(html, `${theme}-theme`);
    }
  }

  getTheme(): ColorTheme {
    return this.currentTheme;
  }
}
