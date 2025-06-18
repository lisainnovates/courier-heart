
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RefreshCw, Clock, Zap } from "lucide-react";

interface Delivery {
  id: string;
  title: string;
  description: string;
  recipient: string;
  difficulty: "easy" | "medium" | "hard";
  corrupted: boolean;
}

interface DeliverySystemProps {
  onStartDelivery: (delivery: Delivery) => void;
  gameState: "stable" | "glitching" | "corrupted";
}

const deliveryTemplates = [
  { title: "A memory of spring rain", description: "Warm droplets on fresh leaves, the scent of renewal", recipient: "The Forgotten Garden" },
  { title: "A lost melody", description: "Ancient song that once filled empty halls with hope", recipient: "The Silent Observatory" },
  { title: "The taste of warm bread", description: "Comfort baked into every crumb, sweetness that transcends time", recipient: "Empty Kitchen Unit" },
  { title: "First snow's silence", description: "The hush that falls when winter first kisses the earth", recipient: "The Waiting Room" },
  { title: "Ocean waves at midnight", description: "Endless rhythm, ancient songs of salt and moon", recipient: "Desert Simulation" },
  { title: "A cat's contented purr", description: "Vibrations of pure peace, trust made audible", recipient: "Lonely Apartment 404" },
  { title: "Dancing shadows at sunset", description: "Light and darkness waltzing on cobblestone", recipient: "The Empty Plaza" },
  { title: "The smell of old books", description: "Wisdom and adventure captured in yellowed pages", recipient: "Digital Library Core" },
  { title: "Starlight through window panes", description: "Gentle beams of distant suns illuminating quiet corners", recipient: "The Abandoned Tower" },
  { title: "The sound of rain on leaves", description: "Nature's symphony playing for no audience but the wind", recipient: "Synthetic Forest" }
];

export const DeliverySystem = ({ onStartDelivery, gameState }: DeliverySystemProps) => {
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDelivery = (): Delivery => {
    const template = deliveryTemplates[Math.floor(Math.random() * deliveryTemplates.length)];
    const difficulties = ["easy", "medium", "hard"] as const;
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: template.title,
      description: template.description,
      recipient: template.recipient,
      difficulty,
      corrupted: gameState === "corrupted" && Math.random() > 0.3
    };
  };

  const generateNewDeliveries = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newDeliveries = Array.from({ length: 3 }, generateDelivery);
      setAvailableDeliveries(newDeliveries);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    generateNewDeliveries();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-warm-teal";
      case "medium": return "text-soft-lavender";
      case "hard": return "text-warm-coral";
      default: return "text-warm-teal";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <Clock size={12} />;
      case "medium": return <Zap size={12} />;
      case "hard": return <Zap size={12} className="animate-pulse" />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-mono text-creamy-white font-bold tracking-wide">DELIVERY REQUESTS</h2>
          <p className="text-sm text-creamy-white/60 font-poppins">Select a dream to encode and deliver</p>
        </div>
        <Button 
          onClick={generateNewDeliveries}
          disabled={isGenerating}
          className="bg-warm-teal/30 hover:bg-warm-teal/50 text-creamy-white border border-warm-teal/50 transition-all duration-300 font-mono font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-warm-teal/20 hover:shadow-xl"
        >
          <RefreshCw size={16} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "SCANNING..." : "REFRESH REQUESTS"}
        </Button>
      </div>

      <div className="grid gap-6">
        {availableDeliveries.map((delivery, index) => (
          <Card 
            key={delivery.id} 
            className={`bg-black/30 backdrop-blur-md border transition-all duration-500 hover:bg-black/40 group shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
              delivery.corrupted 
                ? "border-warm-coral/50 hover:border-warm-coral/70 hover:shadow-warm-coral/10" 
                : "border-soft-lavender/50 hover:border-soft-lavender/70 hover:shadow-soft-lavender/10"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <CardTitle className={`font-mono text-sm font-bold tracking-wide flex items-center gap-2 ${
                    delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
                  }`}>
                    {delivery.corrupted ? "⚠ CORRUPTED DATA ⚠" : "✓ VERIFIED REQUEST"}
                  </CardTitle>
                  <CardDescription className="text-creamy-white font-poppins italic text-lg font-light leading-relaxed">
                    "{delivery.title}"
                  </CardDescription>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                  delivery.difficulty === 'easy' ? 'border-warm-teal/50 bg-warm-teal/10' :
                  delivery.difficulty === 'medium' ? 'border-soft-lavender/50 bg-soft-lavender/10' :
                  'border-warm-coral/50 bg-warm-coral/10'
                } ${getDifficultyColor(delivery.difficulty)}`}>
                  {getDifficultyIcon(delivery.difficulty)}
                  {delivery.difficulty.toUpperCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-creamy-white/90 text-sm leading-relaxed font-poppins">
                {delivery.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-soft-lavender/20">
                <div className="space-y-1">
                  <span className="text-xs text-creamy-white/60 font-mono uppercase tracking-wide">
                    Recipient
                  </span>
                  <div className="text-sm text-creamy-white font-mono font-medium">
                    {delivery.recipient}
                  </div>
                </div>
                <Button
                  onClick={() => onStartDelivery(delivery)}
                  className={`font-mono text-sm transition-all duration-300 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    delivery.corrupted
                      ? "bg-warm-coral/30 hover:bg-warm-coral/50 text-creamy-white border border-warm-coral/50 hover:shadow-warm-coral/20"
                      : "bg-warm-teal/30 hover:bg-warm-teal/50 text-creamy-white border border-warm-teal/50 hover:shadow-warm-teal/20"
                  }`}
                >
                  ACCEPT DELIVERY
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
