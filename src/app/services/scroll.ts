import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor(private ngZone: NgZone) {}

  observeFadeUps(root: HTMLElement): void {
    const els =
Array.from(root.querySelectorAll<HTMLElement>('.fade-up')); 
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        this.ngZone.run(() => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as
HTMLElement).classList.add('visible');
              observer.unobserve(e.target);
            }
          });
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 
'smooth', block: 'start' });
  }
}
