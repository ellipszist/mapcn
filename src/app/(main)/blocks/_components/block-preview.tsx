"use client";

import { useState } from "react";
import { Check, Maximize, Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RegistryBlockItem, type FileTree } from "@/lib/blocks";
import { trackEvent } from "@/lib/events";
import { BlockViewerCode, type HighlightedFile } from "./block-viewer-code";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BlockPreviewProps {
  block: RegistryBlockItem;
  children: React.ReactNode;
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}

export function BlockPreview({
  block,
  children,
  tree,
  highlightedFiles,
}: BlockPreviewProps) {
  const { name, title, description, meta } = block;
  const [copiedType, setCopiedType] = useState<"code" | "cli" | null>(null);

  async function copyCli() {
    await navigator.clipboard.writeText(`npx shadcn@latest add @mapcn/${name}`);
    setCopiedType("cli");
    setTimeout(() => setCopiedType(null), 2000);
    trackEvent({ name: "copy_block_cli", properties: { block: name } });
  }

  return (
    <div
      className="space-y-4"
      style={
        {
          "--block-preview-height": meta?.iframeHeight ?? "930px",
        } as React.CSSProperties
      }
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
        )}
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="h-8!">
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              Code
            </TabsTrigger>
          </TabsList>

          <div className="hidden items-center gap-2.5 md:flex">
            <Button
              onClick={copyCli}
              variant="outline"
              aria-label="Copy CLI command"
              size="sm"
              className="font-mono text-xs"
            >
              {copiedType === "cli" ? <Check /> : <Terminal />}
              npx shadcn add @mapcn/{name}
            </Button>
            <Separator orientation="vertical" className="h-4!" />
            <Button
              variant="outline"
              size="icon-sm"
              asChild
              aria-label="Open in new tab"
            >
              <Link href={`/view/${name}`} target="_blank">
                <Maximize />
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="mt-3">
          {children}
        </TabsContent>

        <TabsContent value="code" className="mt-3">
          <BlockViewerCode tree={tree} highlightedFiles={highlightedFiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
