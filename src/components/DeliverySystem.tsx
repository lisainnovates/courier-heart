
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
  { title: "A lost lullaby", description: "Mother's voice, soft and eternal, wrapped in starlight", recipient: "Child in Sector 7" },
  { title: "The taste of grandmother's cookies", description: "Love baked into every crumb, sweetness that transcends time", recipient: "Empty Kitchen Unit" },
  { title: "First snow's silence", description: "The hush that falls when winter first kisses the earth", recipient: "The Waiting Room" },
  { title: "Ocean waves at midnight", description: "Endless rhythm, ancient songs of salt and moon", recipient: "Desert Simulation" },
  { title: "A cat's contented purr", description: "Vibrations of pure peace, trust made audible", recipient: "Lonely Apartment 404" },
  { title: "Dancing shadows at sunset", description: "Light and darkness waltzing on cobblestone", recipient: "The Empty Plaza" },
  { title: "The smell of old books", description: "Wisdom and adventure captured in yellowed pages", recipient: "Digital Library Core" }
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
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-green-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-mono text-green-400">DELIVERY REQUESTS</h2>
        <Button 
          onClick={generateNewDeliveries}
          disabled={isGenerating}
          className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-400/30"
        >
          {isGenerating ? "SCANNING..." : "REFRESH REQUESTS"}
        </Button>
      </div>

      <div className="grid gap-4">
        {availableDeliveries.map((delivery) => (
          <Card 
            key={delivery.id} 
            className={`bg-black/50 border transition-all duration-300 hover:bg-black/70 ${
              delivery.corrupted 
                ? "border-red-400/30 hover:border-red-400/50" 
                : "border-green-400/30 hover:border-green-400/50"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-mono text-sm ${
                  delivery.corrupted ? "text-red-400" : "text-green-400"
                }`}>
                  {delivery.corrupted ? "⚠ CORRUPTED DATA ⚠" : "✓ VERIFIED REQUEST"}
                </CardTitle>
                <span className={`text-xs font-mono ${getDifficultyColor(delivery.difficulty)}`}>
                  {delivery.difficulty.toUpperCase()}
                </span>
              </div>
              <CardDescription className="text-green-300/80 font-serif italic">
                "{delivery.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-green-200/70 text-sm mb-3 leading-relaxed">
                {delivery.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400/60 font-mono">
                  RECIPIENT: {delivery.recipient}
                </span>
                <Button
                  onClick={() => onStartDelivery(delivery)}
                  size="sm"
                  className={`font-mono text-xs ${
                    delivery.corrupted
                      ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30"
                      : "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-400/30"
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
