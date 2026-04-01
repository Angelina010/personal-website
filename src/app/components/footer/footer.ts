import { Component } from '@angular/core';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();

  constructor(private scrollSvc: ScrollService) {}

  scrollToTop(): void {
    this.scrollSvc.scrollTo('hero');
  }
}
