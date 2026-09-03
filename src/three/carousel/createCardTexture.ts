import { CanvasTexture, LinearFilter, sRGBEncoding } from 'three';
import type { CarouselItem } from '../../types/home';

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

export function createCardTexture(item: CarouselItem) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 960;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is not available.');
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#312e81');
  gradient.addColorStop(0.5, '#0f172a');
  gradient.addColorStop(1, '#164e63');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'rgba(165, 180, 252, 0.56)';
  context.lineWidth = 4;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  context.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let y = 0; y < canvas.height; y += 48) {
    context.fillRect(0, y, canvas.width, 1);
  }

  context.textAlign = 'center';
  context.fillStyle = '#ffffff';
  context.font = '138px "Segoe UI Emoji", sans-serif';
  context.fillText(item.icon, canvas.width / 2, 270);

  context.font = '700 64px "Noto Sans TC", sans-serif';
  wrapText(context, item.title, 620, 2).forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 430 + index * 80);
  });

  context.fillStyle = '#cbd5e1';
  context.font = '400 35px "Noto Sans TC", sans-serif';
  wrapText(context, item.description, 590, 4).forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 610 + index * 51);
  });

  context.fillStyle = item.link === '#' ? '#94a3b8' : '#67e8f9';
  context.font = '700 29px "Noto Sans TC", sans-serif';
  context.fillText(item.link === '#' ? 'MODULE PLANNED' : 'OPEN MODULE  →', canvas.width / 2, 875);

  const texture = new CanvasTexture(canvas);
  texture.encoding = sRGBEncoding;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
