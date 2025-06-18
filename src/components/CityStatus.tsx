
import { Heart, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CityStatusProps {
  hearts: number;
  totalHearts: number;
  gameState: "stable" | "glitching" | "corrupted";
}

export const CityStatus = ({ hearts, totalHearts, gameState }: CityStatusProps) => {
  const getStatusMessage = () => {
    const percentage = (hearts / totalHearts) * 100;
    
    if (percentage >= 80) {
      return { text: "City systems running optimally. The simulation hums with restored dreams.", icon: Shield, color: "text-warm-teal" };
    } else if (percentage >= 50) {
      return { text: "Partial system restoration detected. Reality flickers but holds.", icon: Zap, color: "text-soft-lavender" };
    } else {
      return { text: "Critical system failure. The city's heart beats weakly.", icon: Heart, color: "text-warm-coral" };
    }
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-soft-lavender/50 h-fit">
      <CardHeader>
        <CardTitle className="text-creamy-white font-mono text-sm flex items-center gap-2 font-bold">
          <StatusIcon size={16} className={status.color} />
          CITY STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-creamy-white font-mono">HEARTS RESTORED</span>
            <span className="text-warm-teal font-mono font-bold">{hearts}/{totalHearts}</span>
          </div>
          
          <div className="w-full bg-black/40 rounded-full h-3 border border-soft-lavender/30">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                gameState === "corrupted" ? "bg-warm-coral" :
                gameState === "glitching" ? "bg-soft-lavender" : "bg-warm-teal"
              }`}
              style={{ width: `${(hearts / totalHearts) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {Array.from({ length: totalHearts }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className={`mx-auto transition-all duration-300 ${
                i < hearts
                  ? gameState === "corrupted" 
                    ? "text-warm-coral fill-warm-coral/50"
                    : gameState === "glitching"
                    ? "text-soft-lavender fill-soft-lavender/50"
                    : "text-warm-teal fill-warm-teal/50"
                  : "text-gray-500"
              }`}
            />
          ))}
        </div>

        <div className="border-t border-soft-lavender/50 pt-4">
          <p className="text-xs text-creamy-white/90 leading-relaxed italic">
            {status.text}
          </p>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-creamy-white/80">MEMORY USAGE</span>
            <span className={`font-bold ${
              gameState === "corrupted" ? "text-warm-coral" : "text-warm-teal"
            }`}>{85 - hearts * 3}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-creamy-white/80">DREAM BANDWIDTH</span>
            <span className="text-warm-teal font-bold">{hearts * 12}kb/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-creamy-white/80">HOPE LEVELS</span>
            <span className={`font-bold ${status.color}`}>{Math.round((hearts / totalHearts) * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
