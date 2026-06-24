"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { mapInstallAgentPrompt } from "@/lib/llm-prompts";
import { Button } from "@/components/ui/button";

export function AgentPrompt() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(mapInstallAgentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  }

  return (
    <Button
      type="button"
      onClick={copyPrompt}
      aria-live="polite"
      variant="ghost"
      size="xs"
      className="border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 h-7 gap-1.5 rounded-full border"
    >
      {copied && <Check />}
      {copied
        ? "Copied - paste it into your coding agent"
        : "Building with an agent? Copy the prompt"}
    </Button>
  );
}
