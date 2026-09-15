import { ProductSkeleton } from '@/components/product/ProductSkeleton';

export default function CategoryLoading() {
  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded-md bg-muted animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-28 rounded-md bg-muted animate-pulse" />
        </div>

        <div className="h-56 w-full rounded-3xl bg-muted animate-pulse" />

        <div className="space-y-3">
          <div className="h-4 w-44 rounded-md bg-muted animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="h-10 w-full rounded-2xl border border-border bg-card animate-pulse" />
            <div className="h-48 w-full rounded-2xl border border-border bg-card animate-pulse" />
            <div className="h-36 w-full rounded-2xl border border-border bg-card animate-pulse" />
          </div>

          <div className="lg:col-span-9 space-y-4">
            <div className="h-14 w-full rounded-2xl border border-border bg-card animate-pulse" />
            <ProductSkeleton count={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
