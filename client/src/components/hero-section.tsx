import { SiDiscord } from "react-icons/si";
import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  cardCount: number;
}

export function HeroSection({ cardCount }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent border-b">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 relative">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <SiDiscord className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Connected to Discord</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Kissune Card Collection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse {cardCount.toLocaleString()} cards uploaded from Discord. 
              Add new cards instantly with the <code className="px-2 py-1 bg-muted rounded text-sm font-mono">/addcard</code> command.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>New cards appear instantly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
