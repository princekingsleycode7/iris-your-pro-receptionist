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
        alt="Clover Nexus logo"
        width={size}
        height={size}
        className={invert ? "invert" : ""}
        style={{ width: size, height: size }}
      />
      <span className="text-sm sm:text-base font-black tracking-[0.16em] whitespace-nowrap font-[family-name:var(--font-display)]">
        CLOVER NEXUS
      </span>
    </span>
  );
}
