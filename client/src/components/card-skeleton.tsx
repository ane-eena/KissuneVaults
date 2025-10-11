export function CardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card animate-pulse">
      <div className="aspect-square bg-muted/50" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted/50 rounded w-3/4" />
        <div className="h-4 bg-muted/50 rounded w-1/2" />
      </div>
    </div>
  );
}
