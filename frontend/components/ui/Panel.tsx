import type { HTMLAttributes, ReactNode } from "react";

export function Panel({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={`dash-panel ${className}`} {...props}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>{eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "neutral" | "red" }) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}
