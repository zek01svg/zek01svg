import { useState, useEffect } from "react";
import { Briefcase, Layers, Code, Home, GraduationCap } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import { Link } from "@tanstack/react-router";

const navLinks = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/experience", icon: Briefcase, label: "Experience" },
  { to: "/projects", icon: Layers, label: "Projects" },
  { to: "/toolkit", icon: Code, label: "Toolkit" },
  { to: "/education", icon: GraduationCap, label: "Education" },
] as const;

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 120;
    if (!isTop && info.offset.y < -threshold) {
      setIsTop(true);
    } else if (isTop && info.offset.y > threshold) {
      setIsTop(false);
    }
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-background/90 backdrop-blur-md border-t border-border flex items-center justify-around px-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-100">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center justify-center p-3 min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{
              className:
                "flex flex-col items-center justify-center p-3 min-w-[44px] min-h-[44px] text-foreground transition-colors",
            }}
          >
            <Icon className="w-5 h-5 pointer-events-none" />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
        {mounted && (
          <div className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px]">
            <ThemeToggle
              isTop={false}
              className="border-l-0 pl-0 ml-0 p-3 min-w-[44px] min-h-[44px]"
            />
          </div>
        )}
      </nav>
    );
  }

  return (
    <motion.nav
      layout
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className={`fixed ${
        isTop ? "top-6" : "bottom-6"
      } left-1/2 -translate-x-1/2 w-auto bg-background/60 backdrop-blur-md px-5 py-2.5 rounded-none border border-border flex items-center gap-6 shadow-none z-100 cursor-grab active:cursor-grabbing select-none`}
    >
      <div className="flex items-center gap-5 text-muted-foreground">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <Tooltip key={to}>
            <TooltipTrigger asChild>
              <Link
                to={to}
                className="hover:text-foreground transition-colors p-2.5 hover:bg-accent rounded-none"
              >
                <Icon className="w-5 h-5 pointer-events-none" />
                <span className="sr-only">{label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side={isTop ? "bottom" : "top"}
              className="bg-card border border-border text-card-foreground rounded-none"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        ))}

        {mounted ? (
          <ThemeToggle isTop={isTop} />
        ) : (
          <div className="w-px h-4 bg-border mx-1" />
        )}
      </div>
    </motion.nav>
  );
}
