import { ShieldAlert, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminsEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
  onAddAdmin: () => void;
}

export function AdminsEmptyState({
  isFiltering,
  onClearFilters,
  onAddAdmin,
}: AdminsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <ShieldAlert className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-foreground">
        {isFiltering ? 'No administrators match your filters' : 'No administrators found'}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {isFiltering
          ? 'Try adjusting your search query, role filter, or status filter to locate the administrator.'
          : 'Create your first administrator and assign granular permissions to delegate store management.'}
      </p>

      <div className="mt-6 flex items-center gap-2.5">
        {isFiltering ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear Filters
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onAddAdmin}
            className="text-xs font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Administrator
          </Button>
        )}
      </div>
    </div>
  );
}
