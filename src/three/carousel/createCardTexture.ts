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

export function createCardTexture(item: CarouselItem) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 960;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is not available.');
  }

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
  gradient.addColorStop(0, '#312e81');
  gradient.addColorStop(0.5, '#0f172a');
  gradient.addColorStop(1, '#164e63');

  context.save();
  context.shadowColor = 'rgba(15, 23, 42, 0.72)';
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

  context.strokeStyle = 'rgba(165, 180, 252, 0.56)';
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
  context.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let y = panel.y; y < panel.y + panel.height; y += 48) {
    context.fillRect(panel.x, y, panel.width, 1);
  }
  context.restore();

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
