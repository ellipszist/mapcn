/** Visitor counts keyed by the feature `NAME_LONG`. */
export const visitorsByCountry: Record<string, number> = {
  "United States": 100,
  Canada: 70,
  Brazil: 65,
  "United Kingdom": 95,
  Germany: 80,
  France: 55,
  India: 90,
  China: 45,
  Japan: 35,
  Australia: 25,
  "South Africa": 20,
  Egypt: 15,
};
export type Theme = "light" | "dark";

/** Resolved colors for the choropleth, per theme. */
interface ChoroplethColors {
  /** Fill for countries with no data (value 0). */
  base: string;
  /** Sequential fill ramp from low → high, mapped to `scaleStops`. */
  ramp: [string, string, string, string];
  /** Fill for the hovered country. */
  hover: string;
}

/**
 * Central map config — colors, the value→color scale, and the initial view.
 * WebGL paint can't read CSS variables, so colors are concrete values per
 * theme. The no-data fill stays muted, while the ramp uses hex equivalents of
 * the grayscale chart tokens from globals.css. Values move toward darker chart
 * colors in light mode and toward chart-1 in dark mode.
 */
export const mapConfig = {
  view: {
    center: [12, 28] as [number, number],
    zoom: 1.4,
    minZoom: 1,
    maxZoom: 4,
  },
  scaleStops: [0, 25, 50, 75, 100] as const,
  colors: {
    light: {
      base: "#eef0f3",
      ramp: ["#d4d4d4", "#737373", "#525252", "#404040"],
      hover: "#0a0a0a",
    },
    dark: {
      base: "#2a2a2a",
      ramp: ["#404040", "#525252", "#737373", "#d4d4d4"],
      hover: "#ffffff",
    },
  } satisfies Record<Theme, ChoroplethColors>,
};
