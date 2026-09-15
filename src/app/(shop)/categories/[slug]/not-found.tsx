import Link from 'next/link';
import { Layers, ArrowLeft, Home } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-6 shadow-xs">
        <Layers className="h-10 w-10" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
        Category Not Found
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md">
        We couldn&apos;t find the department you requested. Please check the URL or browse our full list of shopping departments.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/categories"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-hover active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Categories</span>
        </Link>

        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
