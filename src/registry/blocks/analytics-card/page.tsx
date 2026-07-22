"use client";

import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Map, MapGeoJSON, MapMarker, MarkerContent } from "@/registry/map";
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
      <Card className="relative aspect-16/10 w-full max-w-md gap-0 overflow-hidden">
        <div className="absolute inset-0">
          <Map
            center={[1, 30]}
            scrollZoom={false}
            dragRotate={false}
            dragPan={false}
            doubleClickZoom={false}
            pitchWithRotate={false}
            className="[&_.maplibregl-canvas]:cursor-default! [&_.maplibregl-canvas-container]:cursor-default!"
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
          className="from-card via-card/85 to-card/0 pointer-events-none absolute inset-x-0 top-0 z-10 h-24 rounded-t-xl bg-linear-to-b mask-[linear-gradient(to_bottom,black_70%,transparent)] backdrop-blur-[2px]"
          aria-hidden
        />

        <CardHeader className="relative z-20 gap-1">
          <CardDescription>Visitors</CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {totalVisitors}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {visitorGrowth} growth
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
