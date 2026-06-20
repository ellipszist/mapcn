export const COUNTRIES_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/martynafford/natural-earth-geojson/110m/cultural/ne_110m_admin_0_countries.json";

/** Visitor counts keyed by the feature `NAME_LONG`. */
export const visitorsByCountry: Record<string, number> = {
  Germany: 15,
  "United States": 14,
  "United Kingdom": 12,
  India: 9,
  France: 9,
  Australia: 8,
  Netherlands: 8,
  Spain: 7,
  Italy: 6,
  Sweden: 6,
  Poland: 4,
};

export const MAX_VISITORS = 15;

export type Theme = "light" | "dark";

/** Resolved colors for the choropleth, per theme. */
interface ChoroplethColors {
  /** Map surface behind the countries (also used for country borders). */
  background: string;
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
 * theme. The ramp is a single-hue blue scale tuned for contrast on each
 * theme's basemap.
 */
export const mapConfig = {
  view: {
    center: [12, 28] as [number, number],
    zoom: 1.4,
    minZoom: 1,
    maxZoom: 4,
  },
  scaleStops: [0, 1, 5, 10, MAX_VISITORS] as const,
  colors: {
    light: {
      background: "#fafafa",
      base: "#eef0f3",
      ramp: ["#bfdbfe", "#60a5fa", "#3b82f6", "#1d4ed8"],
      hover: "#1e3a8a",
    },
    dark: {
      background: "#0a0a0a",
      base: "#1a1a1a",
      ramp: ["#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"],
      hover: "#bfdbfe",
    },
  } satisfies Record<Theme, ChoroplethColors>,
};
