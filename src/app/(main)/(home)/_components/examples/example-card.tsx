import { cn } from "@/lib/utils";

interface ExampleCardProps {
  className?: string;
  children: React.ReactNode;
}

export function ExampleCard({ className, children }: ExampleCardProps) {
  return (
    <div
      className={cn(
        "bg-card border-border/50 relative overflow-hidden rounded-xl border shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
