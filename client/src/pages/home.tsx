import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FilterBar } from "@/components/filter-bar";
import { CardGrid } from "@/components/card-grid";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("all");

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds to show new cards from Discord
  });

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = selectedRarity === "all" || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
  }, [cards, searchQuery, selectedRarity]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cardCount={cards.length}
      />
      
      <HeroSection cardCount={cards.length} />
      
      <FilterBar
        selectedRarity={selectedRarity}
        onRarityChange={setSelectedRarity}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <CardGrid cards={filteredCards} isLoading={isLoading} />
      </main>
    </div>
  );
}
