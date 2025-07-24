import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600",
        className,
      )}
    >
      <GraduationCap className="h-6 w-6 text-white" />
    </div>
  );
};

export default Logo;
