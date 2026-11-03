import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  eyebrow?: string;
  title: string;
  intro?: string;
};

export function Section({ eyebrow, title, intro, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-14", className)} {...props}>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">{title}</h2>
          {intro ? <p className="mt-4 text-muted-foreground">{intro}</p> : null}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
