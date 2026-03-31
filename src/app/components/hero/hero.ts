import { Component, AfterViewInit, ElementRef } from        
  '@angular/core';                                            
  import { ScrollService } from '../../services/scroll';      

  @Component({
    selector: 'app-hero',
    standalone: true,
    templateUrl: './hero.html',
    styleUrls: ['./hero.scss'],
  })
  export class HeroComponent implements AfterViewInit {       
    constructor(private el: ElementRef, private scrollSvc:    
  ScrollService) {}

    ngAfterViewInit(): void {
      this.scrollSvc.observeFadeUps(this.el.nativeElement);   
    }

    scrollTo(id: string): void {
      this.scrollSvc.scrollTo(id);
    }
  }