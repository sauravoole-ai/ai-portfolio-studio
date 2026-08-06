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
        className="poetic-atmosphere__veils"
        viewBox="0 0 1200 620"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M-80 510C170 348 350 500 558 402C760 306 914 296 1280 428V680H-80Z" />
        <path d="M-100 560C176 430 372 552 610 464C846 376 1012 408 1300 494V680H-100Z" />
        <path d="M-60 602C210 522 420 590 676 526C906 468 1082 494 1260 548V680H-60Z" />
      </svg>
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
