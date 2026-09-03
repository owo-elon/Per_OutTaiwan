import { CanvasTexture, LinearFilter, sRGBEncoding } from 'three';
import type { CarouselItem } from '../../types/home';

interface CardPalette {
  description: string;
  gradient: [string, string, string];
  planned: string;
  ready: string;
  scanLine: string;
  shadow: string;
  stroke: string;
  title: string;
}

const LIGHT_PALETTE: CardPalette = {
  description: '#475569',
  gradient: ['#ffffff', '#eef2ff', '#cffafe'],
  planned: '#64748b',
  ready: '#0369a1',
  scanLine: 'rgba(79, 70, 229, 0.07)',
  shadow: 'rgba(49, 46, 129, 0.3)',
  stroke: 'rgba(79, 70, 229, 0.58)',
  title: '#172554'
};

const DARK_PALETTE: CardPalette = {
  description: '#cbd5e1',
  gradient: ['#312e81', '#0f172a', '#164e63'],
  planned: '#94a3b8',
  ready: '#67e8f9',
  scanLine: 'rgba(255, 255, 255, 0.06)',
  shadow: 'rgba(0, 0, 0, 0.72)',
  stroke: 'rgba(165, 180, 252, 0.56)',
  title: '#ffffff'
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
) {
  const characters = [...text];
  const lines: string[] = [];
  let line = '';

  for (const character of characters) {
    const candidate = `${line}${character}`;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = character;
      if (lines.length === maxLines - 1) {
        break;
      }
    } else {
      line = candidate;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  return lines;
}

function addRoundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

export function createCardTexture(item: CarouselItem, isDark: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 960;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is not available.');
  }

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const panel = {
    x: 46,
    y: 34,
    width: canvas.width - 92,
    height: canvas.height - 88,
    radius: 38
  };
  const gradient = context.createLinearGradient(
    panel.x,
    panel.y,
    panel.x + panel.width,
    panel.y + panel.height
  );
  gradient.addColorStop(0, palette.gradient[0]);
  gradient.addColorStop(0.5, palette.gradient[1]);
  gradient.addColorStop(1, palette.gradient[2]);

  context.save();
  context.shadowColor = palette.shadow;
  context.shadowBlur = 44;
  context.shadowOffsetY = 24;
  context.fillStyle = gradient;
  addRoundedRectPath(
    context,
    panel.x,
    panel.y,
    panel.width,
    panel.height,
    panel.radius
  );
  context.fill();
  context.restore();

  context.strokeStyle = palette.stroke;
  context.lineWidth = 4;
  addRoundedRectPath(
    context,
    panel.x,
    panel.y,
    panel.width,
    panel.height,
    panel.radius
  );
  context.stroke();

  context.save();
  addRoundedRectPath(
    context,
    panel.x,
    panel.y,
    panel.width,
    panel.height,
    panel.radius
  );
  context.clip();
  context.fillStyle = palette.scanLine;
  for (let y = panel.y; y < panel.y + panel.height; y += 48) {
    context.fillRect(panel.x, y, panel.width, 1);
  }
  context.restore();

  context.textAlign = 'center';
  context.fillStyle = '#ffffff';
  context.font = '138px "Segoe UI Emoji", sans-serif';
  context.fillText(item.icon, canvas.width / 2, 270);

  context.fillStyle = palette.title;
  context.font = '700 64px "Noto Sans TC", sans-serif';
  wrapText(context, item.title, 620, 2).forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 430 + index * 80);
  });

  context.fillStyle = palette.description;
  context.font = '400 35px "Noto Sans TC", sans-serif';
  wrapText(context, item.description, 590, 4).forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 610 + index * 51);
  });

  context.fillStyle = item.link === '#' ? palette.planned : palette.ready;
  context.font = '700 29px "Noto Sans TC", sans-serif';
  context.fillText(
    item.link === '#' ? 'MODULE PLANNED' : 'OPEN MODULE  →',
    canvas.width / 2,
    865
  );

  const texture = new CanvasTexture(canvas);
  texture.encoding = sRGBEncoding;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
