
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
        return "text-warm-coral transform transition-all duration-1000 animate-pulse drop-shadow-[0_0_8px_rgba(255,127,127,0.8)] text-shadow-matrix";
      case "glitching": 
        return "text-soft-lavender opacity-90 transform transition-all duration-500 drop-shadow-[0_0_6px_rgba(200,162,200,0.6)]";
      default: 
        return "text-warm-teal transform transition-all duration-300 drop-shadow-[0_0_4px_rgba(94,234,212,0.4)]";
    }
  };

  const getSubtitleClass = () => {
    switch (gameState) {
      case "corrupted": 
        return "text-creamy-white font-mono font-light tracking-[0.2em] drop-shadow-[0_0_4px_rgba(255,245,225,0.6)]";
      case "glitching": 
        return "text-creamy-white font-mono font-light tracking-[0.15em] opacity-80";
      default: 
        return "text-creamy-white font-mono font-light tracking-[0.1em]";
    }
  };

  return (
    <header className="p-8 border-b border-soft-lavender/30 bg-black/60 backdrop-blur-md relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-lavender/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className={`text-4xl font-mono font-black tracking-[0.3em] uppercase ${getTitleClass()}`}>
            COURIER.EXE
          </h1>
          <p className={`text-base uppercase ${getSubtitleClass()}`}>
            MYSTIC COURIER • DREAM DELIVERY SERVICE
          </p>
        </div>
        
        <div className="text-right space-y-1">
          <div className={`text-sm font-mono transition-colors duration-1000 font-bold tracking-[0.2em] uppercase ${getStatusColor()} drop-shadow-[0_0_3px_currentColor]`}>
            {getStatusText()}
          </div>
          <div className="text-xs text-creamy-white/70 font-mono tracking-[0.15em] uppercase">
            v2.3.7-beta
          </div>
        </div>
      </div>
    </header>
  );
};
