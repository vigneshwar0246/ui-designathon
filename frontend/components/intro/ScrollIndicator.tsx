import { ArrowDown } from "lucide-react";
import { introContent } from "@/config/introContent";

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <ArrowDown size={15} strokeWidth={1.6} />
      <span>{introContent.scrollLabel}</span>
    </div>
  );
}
