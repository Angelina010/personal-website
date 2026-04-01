import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Project } from '../projects/projects';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.html',
  styleUrls: ['./project-modal.scss'],
})
export class ProjectModalComponent implements OnInit, OnDestroy {
  @Input()  project!: Project;
  @Output() close = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  visible = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {}

  @HostListener('document:keydown.escape')
  onEscape(): void { this.dismiss(); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.dismiss();
    }
  }

  dismiss(): void {
    this.visible = false;
    setTimeout(() => this.close.emit(), 280);
  }

  get safeVideoUrl(): SafeResourceUrl | null {
    if (!this.project.videoUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.project.videoUrl);
  }

  openLink(url: string): void {
    window.open(url, '_blank', 'noopener');
  }
}
