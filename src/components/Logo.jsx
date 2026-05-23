import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg",
        className
      )}
    >
      <span className="text-2xl font-semibold leading-none">S</span>
      <span className="sr-only">ShareLoop</span>
    </div>
  );
}
