import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full transition-colors duration-200",
    {
        variants: {
            variant: {
                default: "bg-[hsl(var(--primary)/0.05)] hover:bg-[hsl(var(--primary)/0.10)] border-[hsl(var(--primary)/0.2)]",
                solid: "bg-blue-500 hover:bg-blue-600 text-white border-transparent hover:border-foreground/50",
                ghost: "border-transparent bg-transparent hover:border-muted hover:bg-muted",
            },
            size: {
                default: "px-7 py-1.5 ",
                sm: "px-4 py-0.5 ",
                lg: "px-10 py-2.5 ",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { neon?: boolean }

const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, neon = true, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                <span className={cn(
                  "absolute h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-[hsl(var(--primary))] to-transparent hidden", 
                  neon && "block"
                )} />
                {children}
                <span className={cn(
                  "absolute group-hover:opacity-30 transition-opacity duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-[hsl(var(--primary))] to-transparent hidden", 
                  neon && "block"
                )} />
            </button>
        );
    }
)

NeonButton.displayName = 'Button';

// Renomeando a exportação para evitar conflito com o botão existente
export { NeonButton, buttonVariants }; 