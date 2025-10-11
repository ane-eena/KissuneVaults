import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card } from "@shared/schema";
import { ArrowLeft, Calendar, User, Hash, Download, Share2 } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const rarityColors = {
  common: "border-muted-foreground/30",
  uncommon: "border-chart-2",
  rare: "border-chart-3",
  ultra: "border-primary",
  legendary: "border-transparent bg-gradient-to-r from-chart-3 via-primary to-chart-2",
};

export default function CardDetail() {
  const [, params] = useRoute("/card/:id");
  const { toast } = useToast();

  const { data: card, isLoading } = useQuery<Card>({
    queryKey: ["/api/cards", params?.id],
    enabled: !!params?.id,
  });

  const handleShare = async () => {
    if (!card) return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Card link copied to clipboard",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!card) return;
    window.open(card.imageUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} cardCount={0} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted/50 rounded w-32" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted/50 rounded-lg" />
              <div className="space-y-4">
                <div className="h-10 bg-muted/50 rounded w-3/4" />
                <div className="h-6 bg-muted/50 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} cardCount={0} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <h2 className="text-2xl font-semibold mb-2">Card not found</h2>
          <p className="text-muted-foreground mb-6">
            The card you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rarity = (card.rarity || "common") as keyof typeof rarityColors;
  const createdDate = new Date(card.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} cardCount={0} />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className={cn(
              "relative rounded-lg overflow-hidden border-4 bg-card",
              rarityColors[rarity]
            )}
          >
            <div className="aspect-square">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
                data-testid="img-card-detail"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-3" data-testid="text-card-name">
                {card.name}
              </h1>
              <Badge
                variant="default"
                className="text-sm capitalize"
                data-testid="badge-card-rarity"
              >
                {card.rarity}
              </Badge>
            </div>

            {card.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-base" data-testid="text-card-description">
                  {card.description}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">
                Card Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Card ID</p>
                    <p className="text-sm font-mono font-medium truncate max-w-[120px]" data-testid="text-card-id">
                      {card.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Added On</p>
                    <p className="text-sm font-medium" data-testid="text-card-date">
                      {createdDate}
                    </p>
                  </div>
                </div>

                {card.discordUsername && (
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <SiDiscord className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Added By</p>
                      <p className="text-sm font-medium" data-testid="text-discord-user">
                        @{card.discordUsername}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleDownload}
                data-testid="button-download"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
