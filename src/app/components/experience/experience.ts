import { Component, AfterViewInit, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll';
import { ExperienceModalComponent } from '../experience-modal/experience-modal';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  logoUrl: string;
  tags: string[];
  summary: string;
  bullets: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ExperienceModalComponent],
  templateUrl: './experience.html',
  styleUrls: ['./experience.scss'],
})
export class ExperienceComponent implements AfterViewInit {
  activeExperience = signal<Experience | null>(null);

  readonly experiences: Experience[] = [
    {
      id: 'google',
      company: 'Google',
      role: 'Incoming Software Engineering Intern',
      period: 'May 2026 - Aug. 2026',
      location: 'Kirkland, WA',
      logoUrl: 'assets/google-logo.png',
      tags: ['TypeScript', 'Angular', 'LLM'],
      summary: 'Incoming at BigQuery Team in Google Cloud',
      bullets: [],
    },
    {
      id: 'napp',
      company: 'Napp Lab — Cornell University',
      role: 'Undergraduate Researcher',
      period: 'Jan. 2025 – Present',
      location: 'Ithaca, NY',
      logoUrl: 'assets/napp-lab-logo.png',
      tags: ['Python', 'OpenCV', 'Flask', 'Machine Learning'],
      summary: 'Placeholder — describe the biological or scientific domain of the research.',
      bullets: [
        'Improved bee color tag detection with OpenCV using RGB to HSV conversion, thresholding, morphological erosion',
        'Distinguished yellow bee tags from yellow pollen by detecting black tag numbers, reducing false positive rates from 30.6% to 16.7% and 40.4% to 8.6% in test trials',
        'Built a Flask app to verify tag color with one click, automating file retrieval and replacing manual drag-and-drop',
      ],
    },
    {
      id: 'capitalone',
      company: 'Capital One',
      role: 'Software Engineering Intern',
      period: 'June 2025 - Aug. 2025',
      location: 'McLean, VA',
      logoUrl: 'assets/capital-one-logo.png',
      tags: ['TypeScript', 'Vue', 'Pinia', 'DynamoDB'],
      summary: 'Card Decisioning Team',
      bullets: [
        'Built an internal rules authoring UI with TypeScript and Vue to generate JSON for credit card decision workflows',
        'Reduced authoring errors and increased entry speed by 33%, improving efficiency of credit card approval processes',
        'Implemented Pinia data stores and data models for rules to be passed into backend APIs and stored in DynamoDB',
      ],
    },
    {
      id: 'zhang',
      company: 'Zhang Lab — Cornell University',
      role: 'Undergraduate Researcher',
      period: 'Jan. 2025 – May 2025',
      location: 'Ithaca, NY',
      logoUrl: 'assets/zhang-lab-logo.png',
      tags: ['Python', 'AutoGen', 'LLM', 'Verilog', 'NLP'],
      summary: 'Generating Verilog code with a team of LLM Agents',
      bullets: [
        'Designed and implemented a team of LLM agents using Python and AutoGen to automate and accelerate Verilog hardware design',
        'Developed an iterative feedback-driven workflow, where LLM agents generate Verilog code, execute test benches, analyze results, and improve their designs autonomously',
      ],
    },
    
  ];

  constructor(private el: ElementRef, private scrollSvc: ScrollService) {}

  ngAfterViewInit(): void {
    this.scrollSvc.observeFadeUps(this.el.nativeElement);
  }

  openModal(exp: Experience): void {
    this.activeExperience.set(exp);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeExperience.set(null);
    document.body.style.overflow = '';
  }
}
