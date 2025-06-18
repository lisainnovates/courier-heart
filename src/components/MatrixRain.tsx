
import { useEffect, useRef } from "react";

interface MatrixRainProps {
  intensity: "low" | "medium" | "high";
}

export const MatrixRain = ({ intensity }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const getIntensitySettings = () => {
      switch (intensity) {
        case "high":
          return { speed: 50, opacity: 0.8, color: "#ff0040" };
        case "medium":
          return { speed: 80, opacity: 0.6, color: "#ffff00" };
        default:
          return { speed: 120, opacity: 0.4, color: "#00ff41" };
      }
    };

    const draw = () => {
      const settings = getIntensitySettings();
      
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - settings.opacity * 0.3})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = settings.color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const settings = getIntensitySettings();
    const interval = setInterval(draw, settings.speed);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
};
