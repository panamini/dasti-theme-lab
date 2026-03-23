import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const statusVariants = cva(
  "inline-flex min-h-[var(--control-sm)] items-center justify-center gap-2 rounded-inline border border-transparent px-3 text-body-sm font-medium leading-none whitespace-nowrap select-none",
  {
    variants: {
      tone: {
        success: "bg-successBg text-successText",
        warning: "bg-warningBg text-warningText",
        danger: "bg-dangerBg text-dangerText",
      },
      emphasis: {
        soft: "shadow-none",
        strong: "shadow-sm",
      },
    },
    defaultVariants: {
      tone: "success",
      emphasis: "soft",
    },
  }
);

export type StatusProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusVariants>;

export function Status({ className, tone, emphasis, ...props }: StatusProps) {
  return <div className={cn(statusVariants({ tone, emphasis }), className)} {...props} />;
}
