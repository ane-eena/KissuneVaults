import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { Card } from "@shared/schema";
import { ArrowLeft, Calendar, User, Hash, Download, Share2, Sparkles, ImageIcon, Wallpaper, Frame, Music, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const categoryGradients = {
  limited: "from-yellow-400 via-yellow-500 to-orange-500",
  event: "from-pink-500 via-purple-500 to-cyan-500",
  regular: "from-gray-400 to-gray-500",
  collabs: "from-pink-500 via-purple-500 to-cyan-500",
};

const typeIcons = {
  cards: ImageIcon,
  wallpapers: Wallpaper,
  frames: Frame,
};

export default function CardDetail() {
  const [, params] = useRoute("/card/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: card, isLoading } = useQuery<Card>({
    queryKey: ["/api/cards", params?.id],
    enabled: !!params?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest(`/api/cards/${params?.id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "✨ Card deleted!",
        description: "The card has been removed from the collection",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Failed to delete",
        description: "Could not delete the card",
        variant: "destructive",
      });
    },
  });

  const handleShare = async () => {
    if (!card) return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "✨ Link copied!",
        description: "Share this K-pop item with your friends",
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
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-40" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-[794/1154] bg-muted rounded-xl" />
              <div className="space-y-6">
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-1/2" />
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
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Item not found</h2>
          <p className="text-muted-foreground mb-8">
            This K-pop item doesn't exist in the collection.
          </p>
          <Link href="/">
            <Button size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = (card.category || "regular") as keyof typeof categoryGradients;
  const itemType = (card.itemType || "cards") as keyof typeof typeIcons;
  const TypeIcon = typeIcons[itemType];
  const gradient = categoryGradients[category];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="lg" className="hover-elevate" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Collection
            </Button>
          </Link>

          {user?.isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" size="lg" data-testid="button-edit">
                <Pencil className="w-5 h-5 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => setShowDeleteDialog(true)}
                data-testid="button-delete"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className={cn(
            "relative rounded-2xl overflow-hidden",
            itemType === "wallpapers" ? "aspect-[2635/1636]" : "aspect-[794/1154]"
          )}>
            <div className={cn(
              "absolute -inset-1 bg-gradient-to-br rounded-2xl blur opacity-75",
              gradient
            )} />
            <div className="relative w-full h-full bg-card rounded-2xl overflow-hidden">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
                data-testid="img-card-detail"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 dark:from-pink-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent font-display" data-testid="text-card-name">
                {card.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r text-white font-bold",
                  gradient
                )}>
                  <Sparkles className="w-4 h-4" />
                  <span className="capitalize">{category}</span>
                </div>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-bold capitalize flex items-center gap-2">
                  <TypeIcon className="w-4 h-4" />
                  {itemType}
                </Badge>
              </div>
            </div>

            {/* K-pop Metadata */}
            {(card.idolName || card.group || card.theme || card.subcat || card.code) && (
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground">
                  K-POP INFO
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {card.idolName && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Idol</p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        <Music className="w-4 h-4 text-primary" />
                        {card.idolName}
                      </p>
                    </div>
                  )}
                  {card.group && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Group</p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {card.group}
                      </p>
                    </div>
                  )}
                  {card.theme && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Theme</p>
                      <p className="text-lg font-bold">{card.theme}</p>
                    </div>
                  )}
                  {card.subcat && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Subcat</p>
                      <p className="text-lg font-bold">{card.subcat}</p>
                    </div>
                  )}
                  {card.code && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Code</p>
                      <p className="text-lg font-mono font-bold text-primary">
                        {card.code}{card.printNumber ? `#${card.printNumber}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {card.description && (
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-sm font-bold text-muted-foreground mb-2">
                  DESCRIPTION
                </h3>
                <p className="text-lg leading-relaxed" data-testid="text-card-description">
                  {card.description}
                </p>
              </div>
            )}

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground">
                ADDITIONAL INFO
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Added</p>
                    <p className="text-sm font-semibold truncate" data-testid="text-card-date">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {card.discordUsername && (
                  <div className="col-span-2 flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Collector</p>
                      <p className="text-lg font-bold" data-testid="text-discord-user">
                        @{card.discordUsername}
                      </p>
                    </div>
                  </div>
                )}

                {(card.canvasWidth && card.canvasHeight) && (
                  <div className="col-span-2 flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Canvas Size</p>
                      <p className="text-lg font-bold">
                        {card.canvasWidth} × {card.canvasHeight}px
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg h-14"
                onClick={handleDownload}
                data-testid="button-download"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 font-bold text-lg h-14"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the card "{card.name}" from the collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
