
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-mono text-creamy-white font-bold">DELIVERY REQUESTS</h2>
        <Button 
          onClick={generateNewDeliveries}
          disabled={isGenerating}
          className="bg-warm-teal/30 hover:bg-warm-teal/40 text-creamy-white border border-warm-teal/50 transition-colors duration-300 font-mono"
        >
          {isGenerating ? "SCANNING..." : "REFRESH REQUESTS"}
        </Button>
      </div>

      <div className="grid gap-4">
        {availableDeliveries.map((delivery) => (
          <Card 
            key={delivery.id} 
            className={`bg-black/20 backdrop-blur-sm border transition-colors duration-300 hover:bg-black/30 ${
              delivery.corrupted 
                ? "border-warm-coral/50 hover:border-warm-coral/70" 
                : "border-soft-lavender/50 hover:border-soft-lavender/70"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-mono text-sm font-bold ${
                  delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
                }`}>
                  {delivery.corrupted ? "⚠ CORRUPTED DATA ⚠" : "✓ VERIFIED REQUEST"}
                </CardTitle>
                <span className={`text-xs font-mono font-bold ${getDifficultyColor(delivery.difficulty)}`}>
                  {delivery.difficulty.toUpperCase()}
                </span>
              </div>
              <CardDescription className="text-creamy-white font-serif italic text-base">
                "{delivery.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-creamy-white/90 text-sm mb-3 leading-relaxed">
                {delivery.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-creamy-white/80 font-mono">
                  RECIPIENT: {delivery.recipient}
                </span>
                <Button
                  onClick={() => onStartDelivery(delivery)}
                  size="sm"
                  className={`font-mono text-xs transition-colors duration-300 font-bold ${
                    delivery.corrupted
                      ? "bg-warm-coral/30 hover:bg-warm-coral/40 text-creamy-white border border-warm-coral/50"
                      : "bg-warm-teal/30 hover:bg-warm-teal/40 text-creamy-white border border-warm-teal/50"
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
