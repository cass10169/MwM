import manifest from "@/lib/image-manifest.json";
type Props = {
  label: string; filename: string; ratio: string;
  variant?: "mountain" | "lake" | "wildlife" | "prairie" | "detail";
  className?: string; src?: string; alt?: string;
  focalPointX?: number; focalPointY?: number; loading?: "eager" | "lazy";
  sizes?: string; fit?: "cover" | "contain";
};
export function PlaceholderFrame({ label, ratio, className = "", src, alt,
  focalPointX = 50, focalPointY = 50, loading = "lazy",
  sizes = "(max-width: 800px) calc(100vw - 40px), (max-width: 1200px) 50vw, 700px", fit = "cover" }: Props) {
  if (!src) return null;
  const candidates = (manifest as Record<string, Array<{src: string; width: number; height: number}>>)[src];
  const largest = candidates?.at(-1);
  const widths = [480, 768, 1200, 1600, 2048];
  return <div className={`placeholder-frame delivered-photograph ${className}`} style={{ aspectRatio: ratio }}>
    <picture>
      {!candidates && <source type="image/avif" srcSet={widths.map(w => `${src}?width=${w}&format=avif ${w}w`).join(", ")} sizes={sizes} />}
      <source type="image/webp" srcSet={candidates ? candidates.map(c => `${c.src} ${c.width}w`).join(", ") : widths.map(w => `${src}?width=${w}&format=webp ${w}w`).join(", ")} sizes={sizes} />
      <img src={largest?.src ?? `${src}?width=1600&format=jpeg`} alt={alt ?? label}
        loading={loading} fetchPriority={loading === "eager" ? "high" : "auto"} decoding="async"
        width={largest?.width ?? 1600} height={largest?.height ?? 1067}
        style={{ objectPosition: `${focalPointX}% ${focalPointY}%`, objectFit: fit }} />
    </picture>
  </div>;
}
