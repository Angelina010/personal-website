import {
  Component, Input, Output, EventEmitter,
  OnInit, HostListener, inject, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../experience/experience';

@Component({
  selector: 'app-experience-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-modal.html',
  styleUrls: ['./experience-modal.scss'],
})
export class ExperienceModalComponent implements OnInit {
  @Input() experience!: Experience;
  @Output() close = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);
  visible = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

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
}
