import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { introContent } from "@/config/introContent";

export default function EnterDashboardButton({ compact = false }: { compact?: boolean }) {
  const { label, href } = introContent.finalAction;

  return (
    <Link className={compact ? "entry-link entry-link--compact" : "entry-link"} href={href}>
      <span>{label}</span>
      <ArrowUpRight size={compact ? 17 : 20} strokeWidth={1.7} aria-hidden="true" />
    </Link>
  );
}
