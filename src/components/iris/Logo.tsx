import logoAsset from "@/assets/clova-logo.png.asset.json";

export function Logo({
  className = "",
  size = 26,
  invert = false,
}: {
  className?: string;
  size?: number;
  invert?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoAsset.url}
        alt="Clova logo"
        width={size}
        height={size}
        className={invert ? "invert" : ""}
        style={{ width: size, height: size }}
      />
      <span className="text-base font-black tracking-[0.28em] font-[family-name:var(--font-display)]">
        CLOVA
      </span>
    </span>
  );
}
