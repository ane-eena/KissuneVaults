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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4" data-testid="empty-state">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <PackageOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No cards found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          No cards match your search. Try adjusting your filters or add new cards via Discord.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
