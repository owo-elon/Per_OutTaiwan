import {
  TURN_TABLE_AUTO_BRAKE_DELAY_MS,
  TURN_TABLE_FRICTION,
  TURN_TABLE_STOP_THRESHOLD
} from '../constants/turntable';
import type { Prize } from '../types/turntable';

interface TurntableEngineOptions {
  getPrizes: () => Prize[];
  onStop: (prize: Prize) => void;
}

export class TurntableEngine {
  private readonly context: CanvasRenderingContext2D;
  private readonly resizeObserver: ResizeObserver;
  private animationFrameId: number | null = null;
  private autoBrakeTimer: number | null = null;
  private angle = 0;
  private velocity = 0;
  private braking = false;
  private isSpinning = false;
  private size = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: TurntableEngineOptions
  ) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context is not available.');
    }

    this.context = context;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resize();
  }

  spin() {
    if (this.isSpinning || this.options.getPrizes().length < 2) {
      return false;
    }

    this.isSpinning = true;
    this.braking = false;
    this.velocity = 0.25 + Math.random() * 0.12;
    this.autoBrakeTimer = window.setTimeout(() => {
      this.braking = true;
    }, TURN_TABLE_AUTO_BRAKE_DELAY_MS);
    this.tick();
    return true;
  }

  brake() {
    if (this.isSpinning) {
      this.braking = true;
    }
  }

  redraw() {
    this.draw();
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.autoBrakeTimer !== null) {
      clearTimeout(this.autoBrakeTimer);
    }
    this.resizeObserver.disconnect();
    this.animationFrameId = null;
    this.autoBrakeTimer = null;
  }

  private resize() {
    const frame = this.canvas.parentElement ?? this.canvas;
    const frameStyle = getComputedStyle(frame);
    const horizontalInset = parseFloat(frameStyle.paddingLeft)
      + parseFloat(frameStyle.paddingRight);
    const verticalInset = parseFloat(frameStyle.paddingTop)
      + parseFloat(frameStyle.paddingBottom);
    const availableWidth = frame.clientWidth - horizontalInset;
    const availableHeight = frame.clientHeight - verticalInset;
    this.size = Math.max(260, Math.min(
      availableWidth || 520,
      availableHeight || availableWidth || 520
    ));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.size * pixelRatio);
    this.canvas.height = Math.round(this.size * pixelRatio);
    this.canvas.style.width = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.draw();
  }

  private tick = () => {
    if (!this.isSpinning) {
      return;
    }

    this.angle = (this.angle + this.velocity) % (Math.PI * 2);
    if (this.braking) {
      this.velocity *= TURN_TABLE_FRICTION;
    }

    this.draw();

    if (this.braking && this.velocity < TURN_TABLE_STOP_THRESHOLD) {
      this.finish();
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private finish() {
    this.isSpinning = false;
    this.braking = false;
    this.velocity = 0;
    this.animationFrameId = null;
    if (this.autoBrakeTimer !== null) {
      clearTimeout(this.autoBrakeTimer);
      this.autoBrakeTimer = null;
    }

    const prizes = this.options.getPrizes();
    if (prizes.length === 0) {
      return;
    }

    const arc = (Math.PI * 2) / prizes.length;
    const normalized = ((-this.angle) % (Math.PI * 2) + Math.PI * 2)
      % (Math.PI * 2);
    const index = Math.floor(normalized / arc) % prizes.length;
    this.options.onStop(prizes[index]);
  }

  private draw() {
    const prizes = this.options.getPrizes();
    const size = this.size;
    if (!size) {
      return;
    }

    const center = size / 2;
    const radius = size * 0.46;
    const context = this.context;
    context.clearRect(0, 0, size, size);

    if (prizes.length === 0) {
      return;
    }

    const arc = (Math.PI * 2) / prizes.length;
    prizes.forEach((prize, index) => {
      const start = this.angle + index * arc - Math.PI / 2;
      const end = start + arc;
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, radius, start, end);
      context.closePath();
      context.fillStyle = prize.color;
      context.fill();
      context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      context.lineWidth = Math.max(1, size * 0.005);
      context.stroke();

      context.save();
      context.translate(center, center);
      context.rotate(start + arc / 2);
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.shadowColor = 'rgba(0, 0, 0, 0.45)';
      context.shadowBlur = 4;
      context.font = `700 ${Math.max(13, Math.min(22, size * 0.043))}px system-ui`;
      const maxLength = prizes.length > 10 ? 7 : 12;
      const label = prize.text.length > maxLength
        ? `${prize.text.slice(0, maxLength)}…`
        : prize.text;
      context.fillText(label, radius * 0.86, 0);
      context.restore();
    });

    const gradient = context.createRadialGradient(
      center - radius * 0.2,
      center - radius * 0.2,
      0,
      center,
      center,
      radius * 0.16
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.42, '#dbeafe');
    gradient.addColorStop(1, '#7c3aed');
    context.beginPath();
    context.arc(center, center, radius * 0.14, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    context.lineWidth = 3;
    context.stroke();
  }
}
