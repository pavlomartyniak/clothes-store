"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard, LuPackage, LuTags, LuShoppingBag } from "react-icons/lu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Огляд", icon: LuLayoutDashboard, exact: true },
  { href: "/products", label: "Товари", icon: LuPackage },
  { href: "/categories", label: "Категорії", icon: LuTags },
  { href: "/orders", label: "Замовлення", icon: LuShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-ink text-paper"
                : "text-ink-soft hover:bg-paper-soft hover:text-ink"
            )}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
