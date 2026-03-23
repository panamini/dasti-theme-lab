import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap gap-2",
    "rounded-inline border text-body-sm font-semibold",
    "transition duration-fast ease-standard motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "focus-visible:ring-offset-canvas",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border-transparent bg-accent text-onAccent shadow-a",
          "hover:-translate-y-px hover:bg-accentHover",
          "active:translate-y-0 active:scale-[0.99]",
        ].join(" "),
        secondary: [
          "border-borderStrong bg-surfaceRaised text-text shadow-a",
          "hover:-translate-y-px hover:bg-surfaceMuted",
          "active:translate-y-0 active:scale-[0.99]",
        ].join(" "),
        ghost: [
          "border-transparent bg-transparent text-text",
          "hover:bg-surfaceMuted",
          "active:scale-[0.99]",
        ].join(" "),
      },
      size: {
        control: "h-control-md px-2.5",
        prominent: "h-control-lg px-3",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "control",
      fullWidth: false,
    },
  },
);
