import { Badge } from "@/components/ui/badge";
import { ImageIcon, Wallpaper, Frame, Sparkles, Calendar, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  selectedType: string;
  selectedCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
}

const itemTypes = [
  { value: "all", label: "All Items", icon: Star, gradient: "from-pink-500 to-purple-500" },
  { value: "cards", label: "Cards", icon: ImageIcon, gradient: "from-purple-500 to-pink-500" },
  { value: "wallpapers", label: "Wallpapers", icon: Wallpaper, gradient: "from-cyan-500 to-blue-500" },
  { value: "frames", label: "Frames", icon: Frame, gradient: "from-yellow-500 to-orange-500" },
];

const categories = [
  { value: "all", label: "All", icon: Star },
  { value: "limited", label: "Limited", icon: Sparkles },
  { value: "event", label: "Event", icon: Calendar },
  { value: "regular", label: "Regular", icon: ImageIcon },
  { value: "collabs", label: "Collabs", icon: Users },
];

export function FilterBar({ selectedType, selectedCategory, onTypeChange, onCategoryChange }: FilterBarProps) {
  return (
    <div className="sticky top-20 z-40 w-full border-b bg-background/95 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 space-y-3">
        {/* Item Types */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground mb-2">COLLECTION TYPE</h3>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {itemTypes.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => onTypeChange(type.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200",
                    isActive
                      ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg scale-105`
                      : "bg-muted hover:bg-muted/80 text-foreground hover-elevate"
                  )}
                  data-testid={`filter-type-${type.value}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground mb-2">CATEGORY</h3>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.value;
              return (
                <Badge
                  key={cat.value}
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-all hover-elevate flex items-center gap-1.5",
                    isActive && "bg-primary text-primary-foreground shadow-lg"
                  )}
                  onClick={() => onCategoryChange(cat.value)}
                  data-testid={`filter-category-${cat.value}`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
