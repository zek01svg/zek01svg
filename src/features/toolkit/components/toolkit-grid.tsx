import { motion, AnimatePresence } from "framer-motion";
import { TOOLKIT } from "@/constants/data";
import { useState } from "react";

const categories = [
  {
    id: "01",
    title: "Languages",
    items: TOOLKIT.languages,
    description: "Core logic and systems programming.",
  },
  {
    id: "02",
    title: "Cloud Infrastructure",
    items: TOOLKIT.cloud,
    description: "Multi-cloud infrastructure and deployment.",
  },
  {
    id: "03",
    title: "Frameworks",
    items: TOOLKIT.frameworks,
    description: "High-performance frameworks.",
  },
  {
    id: "04",
    title: "Structural Concepts",
    items: TOOLKIT.concepts,
    description: "Architectural patterns and system design.",
  },
];

export default function ToolkitGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="toolkit"
      className="relative w-full overflow-hidden pb-40 pt-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 mb-12"
      >
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.4em] text-muted-foreground uppercase font-bold">
          <h1 className="text-muted-foreground font-bold text-xl">
            <span className="text-muted-foreground/40">{"// "}</span>
            Technical Toolkit
          </h1>
        </div>
      </motion.div>

      {/* Interactive Panels */}
      <div className="flex flex-col border-t border-border/30">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative border-b border-border/30 group"
          >
            <motion.div
              animate={{
                height: hoveredId === category.id ? 280 : 80,
              }}
              className={`relative w-full overflow-hidden flex flex-col justify-center transition-colors duration-500 ${
                hoveredId === category.id
                  ? "bg-foreground/[0.02]"
                  : "bg-transparent"
              }`}
            >
              <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-12 sm:gap-24">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold tracking-tight italic text-muted-foreground group-hover:text-foreground transition-all duration-500 uppercase">
                      {category.title}
                    </h3>
                    <AnimatePresence>
                      {hoveredId === category.id && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] text-muted-foreground/60 font-mono tracking-wider mt-1"
                        >
                          {category.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="h-4 w-px bg-border group-hover:bg-foreground group-hover:h-12 transition-all duration-500" />
              </div>

              <AnimatePresence>
                {hoveredId === category.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-6xl mx-auto w-full px-6 pt-8 pb-12 overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                      {category.items.map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
                          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground/35 hover:text-foreground transition-all duration-300 cursor-default uppercase"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
