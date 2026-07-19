"use client";

import { TrendingUp } from "lucide-react";

import { Map, MapGeoJSON, MapMarker, MarkerContent } from "@/registry/map";
import { Button } from "@/components/ui/button";
import { totalVisitors, visitorGrowth, visitorLocations } from "./data";

// Country borders from a public CDN, or swap in your own GeoJSON.
const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

function bubbleSize(visitors: number) {
  return Math.round(10 + Math.sqrt(visitors) * 2.2);
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="bg-card relative aspect-16/10 w-full max-w-md overflow-hidden rounded-xl border shadow-sm">
        <div className="absolute inset-0">
          <Map
            center={[1, 30]}
            scrollZoom={false}
            dragRotate={false}
            dragPan={false}
            doubleClickZoom={false}
            pitchWithRotate={false}
            blank
          >
            <MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
            {visitorLocations.map((location) => {
              const size = bubbleSize(location.visitors);
              return (
                <MapMarker
                  key={location.city}
                  longitude={location.lng}
                  latitude={location.lat}
                >
                  <MarkerContent className="cursor-default">
                    <span
                      className="bg-chart-2/80 block rounded-full"
                      style={{ width: size, height: size }}
                    />
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>
        </div>

        <div
          className="from-card to-card/0 pointer-events-none absolute inset-x-0 top-0 z-10 h-24 rounded-t-xl bg-linear-to-b [mask-image:linear-gradient(to_bottom,black_55%,transparent)] backdrop-blur-[2px]"
          aria-hidden
        />

        <div className="relative z-20 flex items-start justify-between gap-3 p-4">
          <div>
            <h2 className="text-foreground text-lg font-medium tracking-tight">
              Analytics
            </h2>
            <div className="mt-1.5 flex items-center gap-2">
              <p className="text-muted-foreground text-xs font-medium">
                <span className="tabular-nums">{totalVisitors}</span> visitors
              </p>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium">
                <TrendingUp className="size-2.5" />
                {visitorGrowth}
              </span>
            </div>
          </div>

          <Button variant="outline" size="xs" className="h-7 px-2.5">
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
