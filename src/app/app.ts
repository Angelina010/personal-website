import { Component } from '@angular/core';                    import { NavbarComponent } from                             
  './components/navbar/navbar';                               
  import { HeroComponent } from './components/hero/hero';     

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [NavbarComponent, HeroComponent],
    template: `
      <app-navbar></app-navbar>
      <main>
        <app-hero></app-hero>
      </main>
    `,
  })
  export class App {}