import { Component } from '@angular/core';                  
  import { NavbarComponent } from                             
  './components/navbar/navbar';                               
  import { HeroComponent } from './components/hero/hero';
  import { AboutComponent } from './components/about/about';  

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [NavbarComponent, HeroComponent, AboutComponent],
    template: `
      <app-navbar></app-navbar>
      <main>
        <app-hero></app-hero>
        <app-about></app-about>
      </main>
    `,
  })
  export class App {}