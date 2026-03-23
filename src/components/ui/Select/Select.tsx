import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  fullWidth?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, disabled, fullWidth = false, style, ...props }, ref) => {
    return (
      <div className={cn("relative", fullWidth ? "w-full min-w-0" : "min-w-[16rem]")}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            [
              "h-control-md w-full min-w-0 appearance-none rounded-inline border border-borderStrong",
              "bg-surfaceRaised px-2 pr-9 text-sm text-text shadow-sm",
              "outline-none transition duration-fast ease-standard",
              "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ],
            className,
          )}
          style={style}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-textSubtle"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.8">
            <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    );
  },
);

Select.displayName = "Select";