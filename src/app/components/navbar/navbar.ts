import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  readonly navLinks = [
    { label: 'About',      id: 'about'      },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects',   id: 'projects'   },
    { label: 'Skills',     id: 'skills'     },
  ];

  constructor(private scrollSvc: ScrollService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  navigate(id: string): void {
    this.scrollSvc.scrollTo(id);
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
}
