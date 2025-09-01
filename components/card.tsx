"use client";
import { ReactNode } from "react";

export type CardProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode; // <- make optional
  tight?: boolean;
  className?: string;
};

export function Card({ title, subtitle, children, tight, className }: CardProps) {
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md " + (className ?? "")}>
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
        </header>
      )}
      {children && <div className={tight ? "text-sm" : ""}>{children}</div>}
    </div>
  );
}
