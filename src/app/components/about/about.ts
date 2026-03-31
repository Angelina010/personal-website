import { Component, AfterViewInit, ElementRef } from        
  '@angular/core';                                            
  import { ScrollService } from '../../services/scroll';      

  @Component({
    selector: 'app-about',
    standalone: true,
    templateUrl: './about.html',
    styleUrls: ['./about.scss'],
  })
  export class AboutComponent implements AfterViewInit {      
    constructor(private el: ElementRef, private scrollSvc:    
  ScrollService) {}

    ngAfterViewInit(): void {
      this.scrollSvc.observeFadeUps(this.el.nativeElement);   
    }
  }
