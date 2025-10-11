import { Search, Moon, Sun } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cardCount: number;
}

export function Navbar({ searchQuery, onSearchChange, cardCount }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block">Kissune</h1>
          </div>
          <Badge variant="secondary" className="hidden md:flex gap-1.5" data-testid="badge-card-count">
            <SiDiscord className="w-3 h-3" />
            <span className="text-xs">{cardCount} Cards</span>
          </Badge>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/50"
              data-testid="input-search"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
