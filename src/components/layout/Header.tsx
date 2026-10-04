"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-playfair text-2xl font-bold text-foreground">Nur Portal</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#prayer-times" className="transition-colors hover:text-primary">Prayer Times</Link>
          <Link href="#quran" className="transition-colors hover:text-primary">Qur'an</Link>
          <Link href="#azkar" className="transition-colors hover:text-primary">Azkar</Link>
        </nav>

        <div className="flex items-center">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "p-2 rounded-full transition-all duration-700 ease-in-out",
              "hover:bg-primary/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5 text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )
            ) : (
              <div className="h-5 w-5" /> // Placeholder to prevent layout shift
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
