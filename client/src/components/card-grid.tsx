import { Card } from "@shared/schema";
import { CardItem } from "./card-item";
import { CardSkeleton } from "./card-skeleton";
import { PackageOpen } from "lucide-react";

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
}

export function CardGrid({ cards, isLoading }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4" data-testid="empty-state">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
          <PackageOpen className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No items found</h3>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          No K-pop items match your search. Try different filters or add new items via Discord!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <CardItem key={card._id} card={card} />
      ))}
    </div>
  );
}
