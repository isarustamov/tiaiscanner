import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Button({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button className={cn("rounded-xl bg-cyber px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60", className)} {...props}>{children}</button>;
}
