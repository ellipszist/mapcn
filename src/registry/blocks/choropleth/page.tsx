"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import type { MapLayerMouseEvent, StyleSpecification } from "maplibre-gl";
import { useTheme } from "next-themes";

import { Map, MapControls, MapPopup, useMap } from "@/registry/map";
import {
  COUNTRIES_GEOJSON_URL,
  mapConfig,
  visitorsByCountry,
  type Theme,
} from "./data";

// Transparent background so the themed container (`bg-background`) shows
// through immediately on load, this avoids a white flash before the theme applies.
const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "rgba(0, 0, 0, 0)" },
    },
  ],
};

const MAP_STYLES = { light: MAP_STYLE, dark: MAP_STYLE };

function buildFillColor(theme: Theme): unknown[] {
  const { base, ramp, hover } = mapConfig.colors[theme];
  const [s0, s1, s2, s3, s4] = mapConfig.scaleStops;
  return [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    hover,
    [
      "interpolate",
      ["linear"],
      ["coalesce", ["get", "visitors"], 0],
      s0,
      base,
      s1,
      ramp[0],
      s2,
      ramp[1],
      s3,
      ramp[2],
      s4,
      ramp[3],
    ],
  ];
}

interface HoverInfo {
  name: string;
  visitors: number;
  lng: number;
  lat: number;
}

interface CountryFeatureCollection extends GeoJSON.FeatureCollection {
  features: Array<
    GeoJSON.Feature<GeoJSON.Geometry, { NAME_LONG: string; visitors: number }>
  >;
}

function ChoroplethLayer({
  onHover,
}: {
  onHover: (info: HoverInfo | null) => void;
}) {
  const { map, isLoaded } = useMap();
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const id = useId();
  const sourceId = `countries-${id}`;
  const fillLayerId = `countries-fill-${id}`;
  const lineLayerId = `countries-line-${id}`;

  const dataRef = useRef<CountryFeatureCollection | null>(null);
  const getTheme = useEffectEvent(() => theme);

  // Add the source + layers once.
  useEffect(() => {
    if (!map || !isLoaded) return;
    let cancelled = false;

    const setup = (data: CountryFeatureCollection) => {
      const currentTheme = getTheme();
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data,
          promoteId: "NAME_LONG",
        });
      }
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": buildFillColor(currentTheme) as never,
            "fill-opacity": 0.92,
          },
        });
      }
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": mapConfig.colors[currentTheme].background,
            "line-width": 0.5,
          },
        });
      }
    };

    if (dataRef.current) {
      setup(dataRef.current);
    } else {
      fetch(COUNTRIES_GEOJSON_URL)
        .then((res) => res.json())
        .then((geo: CountryFeatureCollection) => {
          if (cancelled) return;
          for (const feature of geo.features) {
            const name = feature.properties.NAME_LONG;
            feature.properties.visitors = visitorsByCountry[name] ?? 0;
          }
          dataRef.current = geo;
          setup(geo);
        })
        .catch(() => {
          // ignore network errors
        });
    }

    return () => {
      cancelled = true;
      try {
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
  }, [map, isLoaded, sourceId, fillLayerId, lineLayerId]);

  // Recolor in place whenever the resolved theme changes.
  useEffect(() => {
    if (!map) return;
    if (map.getLayer(fillLayerId)) {
      map.setPaintProperty(
        fillLayerId,
        "fill-color",
        buildFillColor(theme) as never,
      );
    }
    if (map.getLayer(lineLayerId)) {
      map.setPaintProperty(
        lineLayerId,
        "line-color",
        mapConfig.colors[theme].background,
      );
    }
  }, [map, isLoaded, theme, fillLayerId, lineLayerId]);

  // Hover interaction: highlight the country and surface the popup.
  useEffect(() => {
    if (!map || !isLoaded) return;
    let hoveredId: string | null = null;

    const clearHover = () => {
      if (hoveredId != null && map.getSource(sourceId)) {
        map.setFeatureState(
          { source: sourceId, id: hoveredId },
          { hover: false },
        );
      }
      hoveredId = null;
    };

    const handleMove = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      const visitors = (feature?.properties?.visitors as number) ?? 0;

      // Only data countries are interactive.
      if (!feature || visitors <= 0) {
        clearHover();
        map.getCanvas().style.cursor = "";
        onHover(null);
        return;
      }

      map.getCanvas().style.cursor = "pointer";

      const featureId = feature.id as string;
      if (featureId !== hoveredId) {
        clearHover();
        hoveredId = featureId;
        map.setFeatureState(
          { source: sourceId, id: featureId },
          { hover: true },
        );

        onHover({
          name: feature.properties?.NAME_LONG as string,
          visitors,
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
        });
      }
    };

    const handleLeave = () => {
      clearHover();
      map.getCanvas().style.cursor = "";
      onHover(null);
    };

    map.on("mousemove", fillLayerId, handleMove);
    map.on("mouseleave", fillLayerId, handleLeave);

    return () => {
      map.off("mousemove", fillLayerId, handleMove);
      map.off("mouseleave", fillLayerId, handleLeave);
      clearHover();
    };
  }, [map, isLoaded, sourceId, fillLayerId, onHover]);

  return null;
}

function Legend({ theme }: { theme: Theme }) {
  const gradient = `linear-gradient(to right, ${mapConfig.colors[theme].ramp.join(", ")})`;

  return (
    <div className="bg-card/90 absolute bottom-4 left-4 z-10 rounded-lg border px-3 py-2.5 backdrop-blur-sm">
      <p className="text-foreground text-xs font-medium">Visitors by country</p>
      <div
        className="mt-2 h-2 w-40 rounded-full"
        style={{ backgroundImage: gradient }}
        suppressHydrationWarning
      />
      <div className="text-muted-foreground flex items-center justify-between pt-1.5 text-[10px]">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export default function Page() {
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const [hover, setHover] = useState<HoverInfo | null>(null);

  return (
    <div className="bg-background relative h-screen overflow-hidden [&_.maplibregl-popup-content]:pointer-events-none">
      <Map
        className="bg-background"
        styles={MAP_STYLES}
        center={mapConfig.view.center}
        zoom={mapConfig.view.zoom}
        minZoom={mapConfig.view.minZoom}
        maxZoom={mapConfig.view.maxZoom}
        dragRotate={false}
        pitchWithRotate={false}
        attributionControl={false}
      >
        <ChoroplethLayer onHover={setHover} />
        <MapControls />
        {hover && (
          <MapPopup
            longitude={hover.lng}
            latitude={hover.lat}
            offset={12}
            closeButton={false}
            className="pointer-events-none p-2"
          >
            <p className="text-popover-foreground text-xs font-medium">
              {hover.name}
            </p>
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: mapConfig.colors[theme].hover }}
                />
                Visitors
              </span>
              <span className="text-foreground text-xs font-semibold tabular-nums">
                {hover.visitors.toLocaleString()}
              </span>
            </div>
          </MapPopup>
        )}
      </Map>

      <Legend theme={theme} />
    </div>
  );
}
