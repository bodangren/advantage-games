interface HeaderProps {
    heading: string
    text?: string
    variant?: "primary" | "warning"
    children?: React.ReactNode
}

export function Header({
    heading,
    text,
    children,
    variant = "primary",
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 py-8 border-b-heavy border-foreground mb-8">
            <div className="grid gap-2">
                <h1 className={`font-serif font-black text-4xl md:text-6xl uppercase tracking-tighter ${variant === "warning" ? "text-destructive" : ""}`}>{heading}</h1>
                {text && <p className={`font-mono text-sm uppercase tracking-widest text-muted-foreground ${variant === "warning" ? "text-destructive/80" : ""}`}>{text}</p>}
            </div>
            {children}
        </div>
    )
}
