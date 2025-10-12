import { Card } from "@shared/schema";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, ImageIcon, Users, Hash, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  card: Card;
}

const categoryGradients = {
  limited: "from-yellow-400 via-yellow-500 to-orange-500",
  event: "from-pink-500 via-purple-500 to-cyan-500",
  regular: "from-gray-400 to-gray-500",
  collabs: "from-pink-500 via-purple-500 to-cyan-500",
};

const categoryIcons = {
  limited: Sparkles,
  event: Calendar,
  regular: ImageIcon,
  collabs: Users,
};

const typeAspects = {
  cards: "aspect-[794/1154]",
  wallpapers: "aspect-[2635/1636]",
  frames: "aspect-[794/1154]",
};

export function CardItem({ card }: CardItemProps) {
  const category = (card.category || "regular") as keyof typeof categoryGradients;
  const itemType = (card.itemType || "cards") as keyof typeof typeAspects;
  const CategoryIcon = categoryIcons[category];
  const gradient = categoryGradients[category];

  // Handle both single image and array of images (show first image in grid)
  const displayImage = Array.isArray(card.imageUrl) ? card.imageUrl[0] : card.imageUrl;
  const isDoubleSided = Array.isArray(card.imageUrl) && card.imageUrl.length > 1;

  return (
    <Link href={`/card/${card._id}`}>
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:scale-105 hover:shadow-2xl",
          typeAspects[itemType]
        )}
        data-testid={`card-item-${card._id}`}
      >
        {/* Gradient Border Effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 rounded-xl",
          gradient
        )}>
          <div className="w-full h-full bg-card rounded-lg" />
        </div>

        {/* Image */}
        <div className="relative w-full h-full">
          <img
            src={displayImage}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Double-sided indicator */}
          {isDoubleSided && (
            <div className="absolute top-3 left-3 z-10">
              <div className="px-2 py-1 rounded-full bg-cyan-500/90 backdrop-blur-md flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">2 Sides</span>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20",
            category === "limited" && "animate-pulse"
          )}>
            <CategoryIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white capitalize">{category}</span>
          </div>
        </div>

        {/* Card Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-white drop-shadow-lg line-clamp-2" data-testid={`text-card-name-${card._id}`}>
              {card.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {card.idolName && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  {card.idolName}
                </Badge>
              )}
              {card.group && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {card.group}
                </Badge>
              )}
              {card.code && (
                <Badge variant="secondary" className="text-xs font-mono bg-primary/20 text-white border-primary/30 backdrop-blur-sm">
                  {card.code}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
