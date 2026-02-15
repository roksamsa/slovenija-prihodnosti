"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "DOMOV" },
  { href: "/primerjava", label: "PRIMERJAVA STRANK" },
  { href: "/stranke", label: "STRANKE" },
  { href: "/kaj-potrebujemo", label: "KAJ POTREBUJEMO" },
  { href: "/platforma", label: "PLATFORMA" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo - Slovenian flag colors */}
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--slovenia-blue)] focus:ring-offset-2 rounded">
          <span
            className="text-xl font-semibold tracking-tight sm:text-2xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            <span className="text-[var(--slovenia-blue)]">Slovenija</span>
            <span className="text-slate-800"> prihodnosti</span>
          </span>
          <span className="h-1 w-10 rounded-full bg-[var(--slovenia-red)]" aria-hidden />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Glavna navigacija">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--slovenia-blue)] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 aria-expanded={mobileOpen}"
          aria-label={mobileOpen ? "Zapri meni" : "Odpri meni"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3"
          aria-label="Mobilna navigacija"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      isActive ? "bg-[var(--slovenia-blue)] text-white" : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
