"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Photo = { src: string; alt: string; width: number; height: number };

export function GalleryCarousel({ photos }: { photos: Photo[] }) {
  return (
    <Carousel opts={{ loop: true, align: "center" }} className="mx-auto w-full max-w-sm">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.src}>
            <figure className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_20px_40px_-30px_rgba(150,30,46,0.4)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="100vw"
                className="h-full w-full rounded-lg object-cover"
              />
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-border/80 bg-background/90 text-primary" />
      <CarouselNext className="right-2 border-border/80 bg-background/90 text-primary" />
    </Carousel>
  );
}
