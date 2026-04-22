"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Automations", href: "#automations" },
  { label: "Contact", href: "#contact" },
];

function DockLink({ label, href, onClose }: { label: string; href: string; onClose?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const scale = useTransform(x, [-80, 0, 80], [0.92, 1.08, 0.92]);
  const springScale = useSpring(scale, { stiffness: 180, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - (rect.left + rect.width / 2));
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ scale: springScale }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => x.set(0)}
      onClick={onClose}
      className="relative text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 px-1 py-0.5 group"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
    </motion.a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/60 relative"
      >
        {/* Logo */}
        <a href="#" className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          egai<span className="text-accent">.</span>
        </a>

        {/* Desktop nav — absolutely centered so it stays mid-screen regardless of logo/button widths */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {LINKS.map((l) => (
            <DockLink key={l.href} {...l} />
          ))}
          <a
            href="https://cal.com/egai-manuel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 px-4 py-1.5 rounded-full transition-colors duration-200"
          >
            Book a Call
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <List size={20} />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-5 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => setOpen(false)}
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 hover:text-accent transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: LINKS.length * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="https://cal.com/egai-manuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="text-xl font-semibold text-white bg-sky-600 hover:bg-sky-700 px-8 py-3 rounded-full transition-colors duration-200"
                >
                  Book a Call
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
