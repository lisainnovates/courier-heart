
interface GameHeaderProps {
  gameState: "stable" | "glitching" | "corrupted";
}

export const GameHeader = ({ gameState }: GameHeaderProps) => {
  const getStatusColor = () => {
    switch (gameState) {
      case "corrupted": return "text-warm-coral";
      case "glitching": return "text-soft-lavender";
      default: return "text-warm-teal";
    }
  };

  const getStatusText = () => {
    switch (gameState) {
      case "corrupted": return "SYSTEM CRITICAL";
      case "glitching": return "SIGNAL UNSTABLE";
      default: return "CONNECTION STABLE";
    }
  };

  const getTitleClass = () => {
    switch (gameState) {
      case "corrupted": 
        return "text-warm-coral transform transition-all duration-1000 animate-pulse";
      case "glitching": 
        return "text-soft-lavender opacity-90 transform transition-all duration-500";
      default: 
        return "text-warm-teal transform transition-all duration-300";
    }
  };

  return (
    <header className="p-8 border-b border-soft-lavender/30 bg-black/60 backdrop-blur-md relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-lavender/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className={`text-3xl font-mono font-bold tracking-wider ${getTitleClass()}`}>
            COURIER.EXE
          </h1>
          <p className="text-base text-creamy-white font-poppins font-light tracking-wide">
            Mystic Courier • Dream Delivery Service
          </p>
        </div>
        
        <div className="text-right space-y-1">
          <div className={`text-sm font-mono transition-colors duration-1000 font-bold tracking-wide ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-xs text-creamy-white/70 font-mono tracking-wider">
            v2.3.7-beta
          </div>
        </div>
      </div>
    </header>
  );
};
