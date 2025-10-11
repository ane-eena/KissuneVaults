import { Sparkles, ImageIcon, Frame, Wallpaper } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import aespaImg from "@assets/aespa-rich-man-all-members-8k-wallpaper-uhdpaper.com-460@5@h_1760211037170.jpg";

interface HeroSectionProps {
  totalCards: number;
  totalWallpapers: number;
  totalFrames: number;
}

export function HeroSection({ totalCards, totalWallpapers, totalFrames }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden border-b">
      {/* K-pop Background Image */}
      <div className="absolute inset-0">
        <img
          src={aespaImg}
          alt="K-pop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 via-purple-500/85 to-cyan-500/90 dark:from-pink-600/95 dark:via-purple-600/90 dark:to-cyan-600/95" />
      </div>
      
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          {/* Discord Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30">
            <SiDiscord className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Add via Discord /addcard</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight font-display">
              <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Kissune
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg font-accent">
              K-pop Collection
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30">
              <ImageIcon className="w-5 h-5 text-pink-200" />
              <span className="text-white font-bold">{totalCards} Cards</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30">
              <Wallpaper className="w-5 h-5 text-cyan-200" />
              <span className="text-white font-bold">{totalWallpapers} Wallpapers</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30">
              <Frame className="w-5 h-5 text-purple-200" />
              <span className="text-white font-bold">{totalFrames} Frames</span>
            </div>
          </div>

          <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
            Collect your favorite K-pop idols! Add cards, wallpapers, and frames instantly from Discord.
          </p>
        </div>
      </div>
    </div>
  );
}
