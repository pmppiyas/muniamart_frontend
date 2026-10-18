'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { HeroSlide } from '@/types/product';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export function HeroSection({ slides = [] }: HeroSectionProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex];

  return (
    <section className="py-4 sm:py-6 bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Full-Width Clean Cinematic Slider with Fixed Uniform Height */}
        <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] rounded-3xl border border-border/70 overflow-hidden bg-card flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-sm group">
          {/* Background Image & Ambient Gradients - Strictly Uniform Height */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-right md:object-center opacity-90 sm:opacity-95 dark:opacity-85 transition-all duration-700 group-hover:scale-105"
            />
            <div className={cn('absolute inset-0 bg-gradient-to-r', currentSlide.bgGradient)} />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/75 via-45% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent sm:hidden" />
          </div>

          {/* Minimalist Slide Text Content */}
          <div className="relative z-10 max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4 my-auto">
            {/* Single Combined Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{currentSlide.badge}</span>
              {currentSlide.discountText && (
                <>
                  <span className="text-primary/40">•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                    {currentSlide.discountText}
                  </span>
                </>
              )}
            </div>

            {/* Bold Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {currentSlide.title}
            </h1>

            {/* Clean Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2 max-w-lg">
              {currentSlide.subtitle}
            </p>

            {/* Single High-Impact Action Button */}
            <div className="pt-2 sm:pt-3">
              <Link
                href={currentSlide.buttonLink}
                className="inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 sm:px-7 text-xs sm:text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <span>{currentSlide.buttonText}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Bottom Navigation: Slide Dots & Arrow Controls */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border/30 mt-4">
            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all cursor-pointer',
                    currentSlideIndex === idx
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                }
                aria-label="Previous slide"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
                }
                aria-label="Next slide"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
