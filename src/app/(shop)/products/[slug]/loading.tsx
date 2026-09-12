export default function ProductDetailLoading() {
  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded-md bg-muted animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-16 rounded-md bg-muted animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-32 rounded-md bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-muted animate-pulse" />
            <div className="flex gap-3">
              <div className="h-20 w-20 rounded-2xl bg-muted animate-pulse" />
              <div className="h-20 w-20 rounded-2xl bg-muted animate-pulse" />
              <div className="h-20 w-20 rounded-2xl bg-muted animate-pulse" />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="h-4 w-36 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-3/4 rounded-xl bg-muted animate-pulse" />
            <div className="h-4 w-44 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-48 rounded-xl bg-muted animate-pulse" />
            <div className="h-20 w-full rounded-2xl bg-muted animate-pulse" />
            <div className="h-12 w-full rounded-2xl bg-muted animate-pulse" />
            <div className="h-16 w-full rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="border-t border-border pt-8 space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-32 rounded-xl bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-xl bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-xl bg-muted animate-pulse" />
          </div>
          <div className="h-48 w-full rounded-3xl bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
