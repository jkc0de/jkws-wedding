import { readdir } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import sharp from "sharp";
import { ImageIcon } from "lucide-react";
import { Section } from "./section";
import { GalleryCarousel, type Photo } from "./gallery-carousel";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_FILE = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Every image dropped into /public/gallery shows up here automatically,
 * sorted by filename. Dimensions are read at build time so the masonry layout
 * never jumps while images load.
 */
async function loadPhotos(): Promise<Photo[]> {
  let files: string[];
  try {
    files = await readdir(GALLERY_DIR);
  } catch {
    return [];
  }

  const images = files.filter((f) => IMAGE_FILE.test(f)).sort();
  return Promise.all(
    images.map(async (file) => {
      const meta = await sharp(path.join(GALLERY_DIR, file)).metadata();
      return {
        src: `/gallery/${encodeURIComponent(file)}`,
        alt: file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        width: meta.width ?? 4,
        height: meta.height ?? 5,
      };
    }),
  );
}

export async function Gallery() {
  const photos = await loadPhotos();

  return (
    <Section id="gallery" eyebrow="Moments" title="Gallery">
      {photos.length === 0 ? (
        <GalleryPlaceholder />
      ) : (
        <>
          {/* Phones: swipeable carousel */}
          <div className="md:hidden">
            <GalleryCarousel photos={photos} />
            <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Swipe for more
            </p>
          </div>
          {/* Desktop: grid */}
          <div className="mx-auto hidden max-w-3xl gap-6 md:grid md:grid-cols-2">
            {photos.map((photo) => (
              <figure
                key={photo.src}
                className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_20px_40px_-30px_rgba(150,30,46,0.4)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="h-full w-full rounded-lg object-cover"
                />
              </figure>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

function GalleryPlaceholder() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex aspect-[4/5] items-center justify-center rounded-lg border border-dashed border-border bg-white/60 text-muted-foreground"
        >
          <ImageIcon className="size-6 opacity-40" />
        </div>
      ))}
      <p className="col-span-full pt-2 text-center text-sm text-muted-foreground">
        Photos coming soon.
      </p>
    </div>
  );
}
