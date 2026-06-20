import {
  AnalyticsExample,
  DeliveryExample,
  EVChargingExample,
  TrailExample,
  FlyToExample,
  ArcExample,
} from "./examples/index";

export function ExamplesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <AnalyticsExample />
      <TrailExample />
      <ArcExample />
      <EVChargingExample />
      <FlyToExample />
      <DeliveryExample />
    </div>
  );
}
