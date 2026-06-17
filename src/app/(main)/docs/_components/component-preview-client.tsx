"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";

interface ComponentPreviewClientProps {
  children: React.ReactNode;
  code: string;
  highlightedCode: string;
  className?: string;
}

export function ComponentPreviewClient({
  children,
  code,
  highlightedCode,
  className,
}: ComponentPreviewClientProps) {
  const [expanded, setExpanded] = useState(false);
  const codeId = useId();

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "h-[420px] w-full overflow-hidden rounded-lg border",
          className,
        )}
      >
        {children}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border">
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} />
        </div>
        <div
          id={codeId}
          className={cn(
            "bg-muted/40 p-4 text-sm [&_code]:bg-transparent! [&_pre]:bg-transparent!",
            expanded
              ? "max-h-[420px] overflow-auto"
              : "max-h-44 overflow-hidden",
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex w-full items-center justify-center",
            !expanded &&
              "from-background to-background/0 bg-linear-to-t pt-12 pb-6",
          )}
        >
          {!expanded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(true)}
              aria-expanded={expanded}
              aria-controls={codeId}
              className="bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted"
            >
              View Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
