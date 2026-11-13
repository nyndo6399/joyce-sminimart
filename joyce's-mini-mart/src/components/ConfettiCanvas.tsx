import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
  onFinish?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'star' | 'heart';
  rotation: number;
  rotationSpeed: number;
  alpha: number;
}

const PASTEL_COLORS = [
  '#F472B6', // pink
  '#FBBF24', // amber
  '#60A5FA', // blue
  '#34D399', // emerald
  '#A78BFA', // purple
  '#FB923C', // orange
  '#F43F5E', // rose
  '#FDE047', // yellow
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const count = 120;
    const shapes: Particle['shape'][] = ['circle', 'square', 'star', 'heart'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 6,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }

    let animId: number;
    let frames = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;

      let alive = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.rotationSpeed;

        if (frames > 40) {
          p.alpha -= 0.015;
        }

        if (p.alpha > 0 && p.y < canvas.height + 40) {
          alive++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'square') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else if (p.shape === 'star') {
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(
                Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
                -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
              );
              ctx.lineTo(
                Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.45),
                -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.45)
              );
            }
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'heart') {
            const h = p.size * 0.7;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.3);
            ctx.bezierCurveTo(-h * 0.5, -h * 0.5, -h, h * 0.2, 0, h);
            ctx.bezierCurveTo(h, h * 0.2, h * 0.5, -h * 0.5, 0, h * 0.3);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (alive > 0) {
        animId = requestAnimationFrame(render);
      } else {
        if (onFinish) onFinish();
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onFinish]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
