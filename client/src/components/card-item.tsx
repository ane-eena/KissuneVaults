import { Card } from "@shared/schema";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CardItemProps {
  card: Card;
}

const rarityColors = {
  common: "border-muted-foreground/30",
  uncommon: "border-chart-2",
  rare: "border-chart-3",
  ultra: "border-primary",
  legendary: "border-transparent bg-gradient-to-r from-chart-3 via-primary to-chart-2",
};

const rarityBadgeVariants = {
  common: "secondary" as const,
  uncommon: "default" as const,
  rare: "default" as const,
  ultra: "default" as const,
  legendary: "default" as const,
};

export function CardItem({ card }: CardItemProps) {
  const rarity = (card.rarity || "common") as keyof typeof rarityColors;

  return (
    <Link href={`/card/${card.id}`}>
      <div
        className={cn(
          "group relative rounded-lg overflow-hidden border bg-card transition-all duration-200 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 cursor-pointer",
          rarityColors[rarity],
          rarity === "legendary" ? "border-4" : "border-t-4"
        )}
        data-testid={`card-item-${card.id}`}
      >
        <div className="aspect-square relative overflow-hidden bg-muted/20">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
          <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-card-name-${card.id}`}>
            {card.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={rarityBadgeVariants[rarity]}
              className="text-xs capitalize"
              data-testid={`badge-rarity-${card.id}`}
            >
              {card.rarity}
            </Badge>
            {card.discordUsername && (
              <span className="text-xs text-white/70 truncate">
                @{card.discordUsername}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
