import { useId } from "react";

type PoeticAtmosphereProps = {
  className?: string;
  variant?: "horizon" | "mist" | "quiet";
};

export function PoeticAtmosphere({
  className = "",
  variant = "horizon",
}: PoeticAtmosphereProps) {
  const grainId = useId().replaceAll(":", "");

  return (
    <div
      className={`poetic-atmosphere poetic-atmosphere--${variant} ${className}`}
      aria-hidden="true"
    >
      <div className="poetic-atmosphere__light" />
      <svg
        className="poetic-atmosphere__contours"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M-80 376C154 274 286 438 520 348S840 202 1280 322" />
        <path d="M-100 424C142 330 318 476 552 392S878 260 1300 366" />
        <path d="M-60 300C176 222 336 360 554 288S862 154 1250 242" />
      </svg>
      <svg
        className="poetic-atmosphere__grain"
        width="100%"
        height="100%"
        focusable="false"
      >
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="17" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </div>
  );
}
