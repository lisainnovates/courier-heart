
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
      return { text: "City systems running optimally. The simulation hums with restored dreams.", icon: Shield, color: "text-green-400" };
    } else if (percentage >= 50) {
      return { text: "Partial system restoration detected. Reality flickers but holds.", icon: Zap, color: "text-yellow-400" };
    } else {
      return { text: "Critical system failure. The city's heart beats weakly.", icon: Heart, color: "text-red-400" };
    }
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-black/50 border-green-400/30 h-fit">
      <CardHeader>
        <CardTitle className="text-green-400 font-mono text-sm flex items-center gap-2">
          <StatusIcon size={16} className={status.color} />
          CITY STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-300/70 font-mono">HEARTS RESTORED</span>
            <span className="text-green-400 font-mono">{hearts}/{totalHearts}</span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                gameState === "corrupted" ? "bg-red-400" :
                gameState === "glitching" ? "bg-yellow-400" : "bg-green-400"
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
                    ? "text-red-400 fill-red-400/30"
                    : gameState === "glitching"
                    ? "text-yellow-400 fill-yellow-400/30"
                    : "text-green-400 fill-green-400/30"
                  : "text-gray-600"
              }`}
            />
          ))}
        </div>

        <div className="border-t border-green-400/20 pt-4">
          <p className="text-xs text-green-200/60 leading-relaxed italic">
            {status.text}
          </p>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-green-300/50">MEMORY USAGE</span>
            <span className={`${
              gameState === "corrupted" ? "text-red-400" : "text-green-400"
            }`}>{85 - hearts * 3}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-300/50">DREAM BANDWIDTH</span>
            <span className="text-green-400">{hearts * 12}kb/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-300/50">HOPE LEVELS</span>
            <span className={`${status.color}`}>{Math.round((hearts / totalHearts) * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
