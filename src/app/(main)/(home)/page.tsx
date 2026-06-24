import Link from "next/link";
import { CSSProperties } from "react";

import { AgentPrompt } from "./_components/agent-prompt";
import { ExamplesGrid } from "./_components/examples-grid";
import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
        <PageHeaderDescription>
          Ready to use, customizable map components for React.
          <br className="hidden sm:block" />
          Built on MapLibre. Styled with Tailwind.
        </PageHeaderDescription>
        <PageActions className="mt-5 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="min-w-36 justify-center">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="min-w-36 justify-center"
            >
              <Link href="/docs/basic-map">View Components</Link>
            </Button>
          </div>
          <AgentPrompt />
        </PageActions>
      </PageHeader>

      <section
        className="animate-fade-in animate-stagger container-wide"
        style={
          {
            "--stagger": 4,
          } as CSSProperties
        }
      >
        <ExamplesGrid />
      </section>

      <Footer />
    </>
  );
}
