import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FilterBar } from "@/components/filter-bar";
import { CardGrid } from "@/components/card-grid";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
    refetchInterval: 5000,
  });

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || card.itemType === selectedType;
      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [cards, searchQuery, selectedType, selectedCategory]);

  const stats = useMemo(() => {
    const totalCards = cards.filter(c => c.itemType === "cards").length;
    const totalWallpapers = cards.filter(c => c.itemType === "wallpapers").length;
    const totalFrames = cards.filter(c => c.itemType === "frames").length;
    return { totalCards, totalWallpapers, totalFrames };
  }, [cards]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <HeroSection 
        totalCards={stats.totalCards}
        totalWallpapers={stats.totalWallpapers}
        totalFrames={stats.totalFrames}
      />
      
      <FilterBar
        selectedType={selectedType}
        selectedCategory={selectedCategory}
        onTypeChange={setSelectedType}
        onCategoryChange={setSelectedCategory}
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <CardGrid cards={filteredCards} isLoading={isLoading} />
      </main>
    </div>
  );
}
