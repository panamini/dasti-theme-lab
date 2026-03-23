import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const cardVariants = cva(
  [
    "relative rounded-card border border-border bg-surfaceRaised text-text shadow-sm",
    "transition duration-fast ease-standard",
  ].join(" "),
  {
    variants: {
      padding: {
        panel: "p-4",
        section: "p-6",
        md: "p-4",
        lg: "p-6",
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:-translate-y-0.5 hover:border-borderStrong hover:shadow-md",
          "focus-within:border-borderStrong focus-within:ring-2 focus-within:ring-focus/35 focus-within:ring-offset-2 focus-within:ring-offset-canvas",
        ].join(" "),
        false: "",
      },
      tone: {
        default: "bg-surfaceRaised",
        muted: "bg-surface",
        elevated: "bg-surfaceRaised shadow-md",
      },
    },
    defaultVariants: {
      padding: "section",
      interactive: false,
      tone: "default",
    },
  },
);

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export function Card({ className, padding, interactive, tone, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ padding, interactive, tone }), className)}
      {...props}
    />
  );
}