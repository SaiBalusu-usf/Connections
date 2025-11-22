import React, { useEffect, useRef } from 'react';

interface LiveBackgroundProps {
  theme?: 'light' | 'dark';
}

const LiveBackground: React.FC<LiveBackgroundProps> = ({ theme = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Configuration
    const particleCount = 100;
    const connectionDistance = 140;
    const focalLength = 400; // Determines FOV/Depth

    // Color Configuration based on theme
    const isDark = theme === 'dark';
    const particleColor = isDark ? '99, 102, 241' : '99, 102, 241'; // brand-500 for both, but could differ
    const lineColor = isDark ? '71, 85, 105' : '148, 163, 184'; // slate-600 vs slate-400

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
    }

    const particles: Particle3D[] = [];

    // Initialize Particles in 3D space
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: (Math.random() - 0.5) * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      });
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1 to 1)
      mouseX = (e.clientX - width / 2) * 0.0005;
      mouseY = (e.clientY - height / 2) * 0.0005;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Rotate the entire system slowly plus mouse influence
      rotationAngle += 0.001;
      const camRotX = mouseY;
      const camRotY = rotationAngle + mouseX;
      
      const cosY = Math.cos(camRotY);
      const sinY = Math.sin(camRotY);

      // Project particles
      const projected: { x: number, y: number, z: number, opacity: number }[] = [];

      particles.forEach(p => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundary wrap-around (Infinite space effect)
        const boundary = 1000;
        if (p.x > boundary) p.x -= boundary * 2;
        if (p.x < -boundary) p.x += boundary * 2;
        if (p.y > boundary) p.y -= boundary * 2;
        if (p.y < -boundary) p.y += boundary * 2;
        if (p.z > boundary) p.z -= boundary * 2;
        if (p.z < -boundary) p.z += boundary * 2;

        // Rotate around Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        
        // Simple projection
        const scale = focalLength / (focalLength + z1 + 500);
        
        if (z1 > -focalLength && scale > 0) {
          const x2d = x1 * scale + width / 2;
          const y2d = p.y * scale + height / 2;
          // Opacity based on depth (fog effect)
          const opacity = Math.max(0, Math.min(1, scale * 0.8));
          
          projected.push({ x: x2d, y: y2d, z: z1, opacity });
        }
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        
        // Draw Node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2 * p1.opacity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p1.opacity})`;
        ctx.fill();

        // Draw Lines
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < connectionDistance) {
            // Line opacity based on distance and particle depth
            const alpha = (1 - dist / connectionDistance) * p1.opacity * p2.opacity * 0.4;
            if (alpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run when theme changes

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-500 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100'
    }`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default LiveBackground;