import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-mono font-bold uppercase tracking-wider transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-2 border-heavy",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary hover:bg-background hover:text-foreground shadow-hard",
        destructive:
          "bg-destructive text-white border-destructive hover:bg-white hover:text-destructive",
        outline:
          "border-foreground bg-background text-foreground hover:bg-primary hover:text-primary-foreground shadow-hard",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-primary hover:text-primary-foreground shadow-hard",
        ghost:
          "border-transparent hover:border-foreground hover:bg-foreground hover:text-background",
        link: "text-primary underline-offset-4 hover:underline border-none shadow-none",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-lg",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
