/**
 * Four thin corner brackets, like the embossed corners of a printed
 * invitation. Place inside a `relative` container.
 */
export function CardCorners() {
  const base = "pointer-events-none absolute size-7 border-primary/50";
  return (
    <>
      <span aria-hidden className={`${base} left-3 top-3 border-l border-t`} />
      <span aria-hidden className={`${base} right-3 top-3 border-r border-t`} />
      <span aria-hidden className={`${base} bottom-3 left-3 border-b border-l`} />
      <span aria-hidden className={`${base} bottom-3 right-3 border-b border-r`} />
    </>
  );
}
