import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  selectedRarity: string;
  onRarityChange: (rarity: string) => void;
}

const rarities = [
  { value: "all", label: "All Cards" },
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "ultra", label: "Ultra" },
  { value: "legendary", label: "Legendary" },
];

export function FilterBar({ selectedRarity, onRarityChange }: FilterBarProps) {
  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {rarities.map((rarity) => (
            <Badge
              key={rarity.value}
              variant={selectedRarity === rarity.value ? "default" : "secondary"}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap transition-all hover-elevate",
                selectedRarity === rarity.value && "bg-primary text-primary-foreground"
              )}
              onClick={() => onRarityChange(rarity.value)}
              data-testid={`filter-rarity-${rarity.value}`}
            >
              {rarity.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
