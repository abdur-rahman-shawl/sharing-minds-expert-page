import * as React from "react"
import { cn } from "@/lib/utils"

type SurfaceProps = React.HTMLAttributes<HTMLDivElement>

export function Surface({ className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[hsl(var(--border))] rounded-xl shadow-[0_12px_40px_-24px_rgba(10,10,10,0.35)]",
        className,
      )}
      {...props}
    />
  )
}

export function ElevatedCard({ className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[hsl(var(--border))] rounded-2xl p-6 shadow-[0_24px_64px_-32px_rgba(10,10,10,0.35)]",
        className,
      )}
      {...props}
    />
  )}

