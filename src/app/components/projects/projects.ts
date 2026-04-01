import { Component, AfterViewInit, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll';
import { ProjectModalComponent } from '../project-modal/project-modal';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  accentColor: string;
  accentBg: string;
  tags: string[];
  summary: string;
  bullets: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  localVideoUrl?: string;
  videoCaption?: string;
  videoCredit?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class ProjectsComponent implements AfterViewInit {
  activeProject = signal<Project | null>(null);

  readonly projects: Project[] = [
    {
      id: 'sketchpad',
      title: 'AI Sketchpad',
      subtitle: 'Web App · AI-Generated Pixel Art',

      imageUrl: 'assets/sketchpad-thumbnail.png',
      accentColor: '#7c3aed',
      accentBg: '#f5f3ff',
      tags: ['HTML', 'CSS', 'JavaScript', 'OpenAI API'],
      summary: 'A browser-based sketchpad where users draw freely and generate pixel art with AI.',
      bullets: [
        'Built a full-stack web application enabling users to create and edit pixel art on a customizable grid-based canvas',
        'Integrated AI-powered prompt-based pixel art generation using the OpenAI API via a Vercel serverless backend',
        'Implemented a color wheel, multiple drawing modes (click and hover), and export canvas as PNG functionality',
      ],
      githubUrl: 'https://github.com/Angelina010/etch-a-sketch',
      demoUrl: 'https://angelina010.github.io/etch-a-sketch/',
      localVideoUrl: 'assets/sketchpad-demo.mp4',
      videoCaption: 'Live demo',
    },
    {
      id: 'flappybird',
      title: 'Voice-Controlled Flappy Bird',
      subtitle: 'Game + Embedded Systems',

      imageUrl: 'assets/flappy-bird.png',
      accentColor: '#059669',
      accentBg: '#ecfdf5',
      tags: ['C', 'Python', 'Embedded Systems'],
      summary: 'A Flappy Bird variant controlled entirely by voice input processed through a microcontroller.',
      bullets: [
        'Built a Flappy Bird-style game controlled by the player’s voice pitch in real-time',
        'Implemented C firmware to sample microphone input via ADC at fixed intervals using PIT timer interrupts and transmit raw data over UART to a host compute',
        'Processed samples in Python to perform FFT, estimate dominant frequency, and update the bird’s position',
      ],
      localVideoUrl: 'assets/flappy-bird-recording.mp4',
      videoCaption: 'Gameplay demo',
      videoCredit: 'Thank you to Julian for demoing!',
    },
    {
      id: 'adventure',
      title: '2D Adventure Game',
      subtitle: 'Unity Game Development',

      imageUrl: 'assets/adventure.jpg',
      accentColor: '#dc2626',
      accentBg: '#fff1f2',
      tags: ['Unity', 'C#'],
      summary: 'A 2D rougelike adventure game developed in Unity, featuring procedurally generated dungeons, combat mechanics, and various enemy types.',
      bullets: [
        'Developed and published a 2D roguelike game on itch.io featuring 3 levels of dungeon exploration and combat',
        'Designed combat mechanics including attack combos, various enemy types, and enemy AI detecting nearby players',
        'Implemented finite state machines for player and enemy behaviors and singletons for centralized game management',
      ],
      githubUrl: 'https://github.com/chctj21/winter-jam',
      demoUrl: 'https://angelina010.itch.io/journey-of-amara',
      localVideoUrl: 'assets/adventure-demo.mp4',
      videoCaption: 'Gameplay walkthrough',
    },
  ];

  constructor(private el: ElementRef, private scrollSvc: ScrollService) {}

  ngAfterViewInit(): void {
    this.scrollSvc.observeFadeUps(this.el.nativeElement);
  }

  openModal(project: Project): void {
    this.activeProject.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeProject.set(null);
    document.body.style.overflow = '';
  }
}
