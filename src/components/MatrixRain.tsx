
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
          return { speed: 80, opacity: 0.6, color: "#FF7F7F", fadeAmount: 0.05 };
        case "medium":
          return { speed: 100, opacity: 0.5, color: "#C8A2C8", fadeAmount: 0.04 };
        default:
          return { speed: 140, opacity: 0.4, color: "#5EEAD4", fadeAmount: 0.03 };
      }
    };

    const draw = () => {
      const settings = getIntensitySettings();
      
      // Use gentle fade instead of harsh clearing
      ctx.fillStyle = `rgba(0, 0, 0, ${settings.fadeAmount})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = settings.color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Add subtle brightness variation instead of harsh flashing
        const brightness = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.1;
        ctx.globalAlpha = Math.max(0.2, brightness);
        
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      ctx.globalAlpha = 1;
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
