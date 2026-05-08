import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ScrollService } from '../../services/scroll';

interface Bubble {
  x: number; y: number; r: number;
  vx: number; vy: number;
  rgb: [number, number, number];
  skill: string;
  revealed: boolean;
  revealAlpha: number;
  popping: boolean;
  popT: number;
  particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[];
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bubbleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') sectionRef!: ElementRef<HTMLElement>;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private bubbles: Bubble[] = [];
  private hoveredBubble: Bubble | null = null;
  private raf = 0;
  private drag: {
    bubble: Bubble;
    ox: number; oy: number;
    px: number; py: number;
    vx: number; vy: number;
    startX: number; startY: number;
    active: boolean;
  } | null = null;
  private resizeObs!: ResizeObserver;

  private readonly COLORS: [number, number, number][] = [
    [91, 143, 238],
    [120, 160, 255],
    [157, 123, 234],
    [180, 140, 250],
    [100, 190, 255],
    [70, 130, 220],
  ];

  private readonly SKILLS = [
    'Python', 'TypeScript', 'Java', 'React', 'Angular',
    'Node.js', 'C++', 'AWS', 'SQL', 'PyTorch', 'Docker', 'Git',
  ];

  constructor(private scrollSvc: ScrollService) {}

  ngAfterViewInit(): void {
    this.scrollSvc.observeFadeUps(this.sectionRef.nativeElement);

    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(this.sectionRef.nativeElement);
    this.resize();
    this.spawnBubbles();

    this.canvas.addEventListener('mousedown', this.onDown);
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.onUp);
    this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    this.raf = requestAnimationFrame(this.loop);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
    this.canvas?.removeEventListener('mousedown', this.onDown);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.onUp);
    this.canvas?.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }

  scrollTo(id: string): void {
    this.scrollSvc.scrollTo(id);
  }

  private resize(): void {
    const s = this.sectionRef.nativeElement;
    this.canvas.width = s.offsetWidth;
    this.canvas.height = s.offsetHeight;
  }

  private spawnBubbles(): void {
    const { width: w, height: h } = this.canvas;
    const isMobile = w < 768;
    const count = isMobile ? 6 : 10;
    const skills = [...this.SKILLS].sort(() => Math.random() - 0.5);

    this.bubbles = [];
    for (let i = 0; i < count; i++) {
      const r = isMobile ? (22 + Math.random() * 45) : (30 + Math.random() * 90);
      this.bubbles.push({
        x: r + Math.random() * (w - r * 2),
        y: r + Math.random() * (h - r * 2),
        r,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        rgb: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
        skill: skills[i % skills.length],
        revealed: false,
        revealAlpha: 0,
        popping: false,
        popT: 0,
        particles: [],
      });
    }
  }

  private loop = (): void => {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(): void {
    const { width: w, height: h } = this.canvas;
    this.bubbles = this.bubbles.filter(b => !(b.popping && b.popT >= 1));

    for (const b of this.bubbles) {
      const target = (b === this.hoveredBubble || b.revealed) ? 1 : 0;
      b.revealAlpha += (target - b.revealAlpha) * 0.1;

      if (b.popping) {
        b.popT = Math.min(1, b.popT + 0.04);
        for (const p of b.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.09;
          p.a = Math.max(0, p.a - 0.032);
        }
        continue;
      }
      if (this.drag?.bubble === b) continue;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x - b.r < 0)  { b.x = b.r;    b.vx =  Math.abs(b.vx); }
      if (b.x + b.r > w)  { b.x = w - b.r; b.vx = -Math.abs(b.vx); }
      if (b.y - b.r < 0)  { b.y = b.r;    b.vy =  Math.abs(b.vy); }
      if (b.y + b.r > h)  { b.y = h - b.r; b.vy = -Math.abs(b.vy); }
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const b of this.bubbles) {
      b.popping ? this.drawPop(b) : this.drawBubble(b);
    }
  }

  private drawBubble(b: Bubble): void {
    const { ctx } = this;
    const { x, y, r, rgb, revealAlpha } = b;
    const c = rgb.join(',');
    const active = this.drag?.bubble === b;

    ctx.save();

    const body = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    body.addColorStop(0,    `rgba(${c},0.01)`);
    body.addColorStop(0.78, `rgba(${c},0.02)`);
    body.addColorStop(1,    `rgba(${c},${active ? 0.1 : 0.06 + revealAlpha * 0.05})`);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();

    ctx.strokeStyle = `rgba(${c},${active ? 0.45 : 0.2 + revealAlpha * 0.25})`;
    ctx.lineWidth = active ? 1.5 : 1;
    ctx.stroke();

    const g1 = ctx.createRadialGradient(
      x - r * 0.38, y - r * 0.38, 0,
      x - r * 0.38, y - r * 0.38, r * 0.5,
    );
    g1.addColorStop(0, 'rgba(255,255,255,0.1)');
    g1.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g1;
    ctx.fill();

    const g2 = ctx.createRadialGradient(
      x + r * 0.3, y + r * 0.5, 0,
      x + r * 0.3, y + r * 0.5, r * 0.28,
    );
    g2.addColorStop(0, 'rgba(255,255,255,0.05)');
    g2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    if (revealAlpha > 0.02) {
      const fontSize = Math.min(13, Math.max(10, r * 0.22));
      ctx.globalAlpha = revealAlpha;
      ctx.fillStyle = `rgba(${c},0.95)`;
      ctx.font = `600 ${fontSize}px 'DM Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.skill, x, y);
    }

    ctx.restore();
  }

  private drawPop(b: Bubble): void {
    const { ctx } = this;
    const { x, y, r, rgb, popT } = b;
    const c = rgb.join(',');

    ctx.save();
    const a1 = Math.max(0, 1 - popT * 2);
    ctx.strokeStyle = `rgba(${c},${a1 * 0.75})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r + popT * 80, 0, Math.PI * 2);
    ctx.stroke();

    const a2 = Math.max(0, 1 - popT * 3.5);
    ctx.strokeStyle = `rgba(${c},${a2 * 0.45})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r + popT * 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    for (const p of b.particles) {
      if (p.a <= 0) continue;
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = `rgba(${c},1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private popBubble(b: Bubble): void {
    b.popping = true;
    b.popT = 0;
    b.particles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const spd = 2 + Math.random() * 4.5;
      return {
        x: b.x, y: b.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 1.5,
        r: 2 + Math.random() * 3,
        a: 1,
      };
    });
  }

  private hitTest(x: number, y: number): Bubble | null {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      if (b.popping) continue;
      if (Math.hypot(b.x - x, b.y - y) <= b.r) return b;
    }
    return null;
  }

  private xy(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  private onDown = (e: MouseEvent): void => {
    const { x, y } = this.xy(e.clientX, e.clientY);
    const b = this.hitTest(x, y);
    if (!b) return;
    e.preventDefault();
    b.vx = 0; b.vy = 0;
    this.hoveredBubble = null;
    this.drag = { bubble: b, ox: b.x - x, oy: b.y - y, px: x, py: y, vx: 0, vy: 0, startX: x, startY: y, active: false };
    this.canvas.style.cursor = 'grabbing';
  };

  private onMove = (e: MouseEvent): void => {
    const { x, y } = this.xy(e.clientX, e.clientY);
    if (!this.drag) {
      const b = this.hitTest(x, y);
      this.hoveredBubble = b;
      this.canvas.style.cursor = b ? 'grab' : 'default';
      return;
    }
    this.applyDrag(x, y);
  };

  private onUp = (): void => {
    if (!this.drag) return;
    if (!this.drag.active) {
      this.drag.bubble.revealed = !this.drag.bubble.revealed;
      this.drag.bubble.vx = 0;
      this.drag.bubble.vy = 0;
    } else {
      this.drag.bubble.vx = this.drag.vx * 0.4;
      this.drag.bubble.vy = this.drag.vy * 0.4;
    }
    this.drag = null;
    this.canvas.style.cursor = 'default';
  };

  private onTouchStart = (e: TouchEvent): void => {
    const t = e.touches[0];
    const { x, y } = this.xy(t.clientX, t.clientY);
    const b = this.hitTest(x, y);
    if (!b) return;
    e.preventDefault();
    b.vx = 0; b.vy = 0;
    this.drag = { bubble: b, ox: b.x - x, oy: b.y - y, px: x, py: y, vx: 0, vy: 0, startX: x, startY: y, active: false };
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.drag) return;
    e.preventDefault();
    const t = e.touches[0];
    const { x, y } = this.xy(t.clientX, t.clientY);
    this.applyDrag(x, y);
  };

  private onTouchEnd = (): void => {
    if (!this.drag) return;
    if (!this.drag.active) {
      this.drag.bubble.revealed = !this.drag.bubble.revealed;
      this.drag.bubble.vx = 0;
      this.drag.bubble.vy = 0;
    } else {
      this.drag.bubble.vx = this.drag.vx * 0.4;
      this.drag.bubble.vy = this.drag.vy * 0.4;
    }
    this.drag = null;
  };

  private applyDrag(x: number, y: number): void {
    const { drag } = this;
    if (!drag) return;
    drag.vx = x - drag.px;
    drag.vy = y - drag.py;
    drag.px = x;
    drag.py = y;
    drag.bubble.x = x + drag.ox;
    drag.bubble.y = y + drag.oy;
    if (!drag.active && Math.hypot(x - drag.startX, y - drag.startY) > 8) {
      drag.active = true;
    }
    if (drag.active && Math.hypot(drag.vx, drag.vy) > 15) {
      this.popBubble(drag.bubble);
      this.drag = null;
      this.canvas.style.cursor = 'default';
    }
  }
}
