import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { getAllBlocks } from "@/lib/blocks";
import { BlockDisplay } from "./_components/block-display";
import { type CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Map Blocks",
  description:
    "Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command.",
};

export default async function Page() {
  const blocks = getAllBlocks();

  return (
    <>
      <PageHeader align="left" size="sm">
        <PageHeaderHeading>Blocks</PageHeaderHeading>
        <PageHeaderDescription>
          Pre-built, ready-to-use map blocks. Browse, preview, and copy them
          into your app with one command.
        </PageHeaderDescription>
      </PageHeader>

      <section
        className="animate-fade-up animate-stagger container scroll-mt-20 space-y-20"
        id="blocks"
        style={
          {
            "--stagger": 4,
          } as CSSProperties
        }
      >
        {blocks.map((block) => (
          <BlockDisplay key={block.name} name={block.name} />
        ))}
      </section>

      <Footer />
    </>
  );
}
