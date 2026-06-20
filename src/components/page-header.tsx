"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, type CSSProperties } from "react";

type HeaderAlign = "center" | "left";

const PageHeaderContext = createContext<{ align: HeaderAlign }>({
  align: "center",
});

function usePageHeaderContext() {
  return useContext(PageHeaderContext);
}

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  /** Header content alignment (default: center) */
  align?: HeaderAlign;
}

function PageHeader({ children, className, align = "center" }: PageHeaderProps) {
  return (
    <PageHeaderContext.Provider value={{ align }}>
      <section
        className={cn(
          "container mx-auto flex w-full max-w-6xl flex-col gap-4 py-16 md:py-20 lg:py-24",
          align === "center"
            ? "items-center text-center"
            : "items-start text-left",
          className,
        )}
      >
        {children}
      </section>
    </PageHeaderContext.Provider>
  );
}

interface PageHeaderHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

function PageHeaderHeading({
  children,
  className,
  as: Comp = "h1",
}: PageHeaderHeadingProps) {
  const { align } = usePageHeaderContext();

  return (
    <Comp
      className={cn(
        "animate-fade-up animate-stagger max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        {
          "--stagger": 1,
        } as CSSProperties
      }
    >
      <span className="from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent">
        {children}
      </span>
    </Comp>
  );
}

interface PageHeaderDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function PageHeaderDescription({
  children,
  className,
}: PageHeaderDescriptionProps) {
  const { align } = usePageHeaderContext();

  return (
    <p
      className={cn(
        "text-foreground/80 animate-fade-up animate-stagger max-w-2xl leading-relaxed sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        {
          "--stagger": 2,
        } as CSSProperties
      }
    >
      {children}
    </p>
  );
}

interface PageActionsProps {
  children: React.ReactNode;
  className?: string;
}

function PageActions({ children, className }: PageActionsProps) {
  const { align } = usePageHeaderContext();

  return (
    <div
      className={cn(
        "animate-fade-up animate-stagger mt-3 flex flex-wrap items-center gap-3",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
      style={
        {
          "--stagger": 3,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions };
