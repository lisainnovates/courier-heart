import { Heart, Zap, Shield, Activity } from "lucide-react";
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
      return { text: "Critical system failure. The city's heart beats weakly.", icon: Activity, color: "text-warm-coral" };
    }
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-black/30 backdrop-blur-md border-soft-lavender/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-creamy-white font-mono text-sm flex items-center gap-3 font-bold tracking-wide">
          <StatusIcon size={18} className={`${status.color} animate-pulse`} />
          CITY STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-creamy-white font-mono text-sm font-medium">HEARTS RESTORED</span>
            <span className="text-warm-teal font-mono font-bold text-lg">{hearts}/{totalHearts}</span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-black/60 rounded-full h-4 border border-soft-lavender/30 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  gameState === "corrupted" ? "bg-gradient-to-r from-warm-coral/70 to-warm-coral" :
                  gameState === "glitching" ? "bg-gradient-to-r from-soft-lavender/70 to-soft-lavender" : 
                  "bg-gradient-to-r from-warm-teal/70 to-warm-teal"
                }`}
                style={{ width: `${(hearts / totalHearts) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-xs text-creamy-white/60 font-mono mt-1 text-center">
              {Math.round((hearts / totalHearts) * 100)}% Complete
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 p-4 bg-black/20 rounded-lg border border-soft-lavender/20">
          {Array.from({ length: totalHearts }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className={`mx-auto transition-all duration-500 transform hover:scale-110 ${
                i < hearts
                  ? gameState === "corrupted" 
                    ? "text-warm-coral fill-warm-coral/70 animate-pulse"
                    : gameState === "glitching"
                    ? "text-soft-lavender fill-soft-lavender/70"
                    : "text-warm-teal fill-warm-teal/70 drop-shadow-sm"
                  : "text-gray-600/50 hover:text-gray-500"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        <div className="border-t border-soft-lavender/30 pt-4">
          <p className="text-sm text-creamy-white/90 leading-relaxed italic font-poppins">
            {status.text}
          </p>
        </div>

        <div className="space-y-3 p-4 bg-black/20 rounded-lg border border-soft-lavender/20">
          <div className="text-xs font-mono text-creamy-white/70 uppercase tracking-wider mb-2">System Metrics</div>
          
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-creamy-white/80">MEMORY USAGE</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-black/60 rounded">
                  <div 
                    className={`h-full rounded transition-all duration-300 ${
                      gameState === "corrupted" ? "bg-warm-coral" : "bg-warm-teal"
                    }`}
                    style={{ width: `${Math.min(100, (85 - hearts * 3))}%` }}
                  />
                </div>
                <span className={`font-bold ${
                  gameState === "corrupted" ? "text-warm-coral" : "text-warm-teal"
                }`}>{85 - hearts * 3}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-creamy-white/80">DREAM BANDWIDTH</span>
              <span className="text-warm-teal font-bold">{hearts * 12}kb/s</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-creamy-white/80">HOPE LEVELS</span>
              <span className={`font-bold ${status.color}`}>{Math.round((hearts / totalHearts) * 100)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
