import { motion } from "framer-motion";
import type { StrapiEducation } from "@/lib/strapi";
import { Badge } from "@/components/ui/badge";

interface Props {
  education: StrapiEducation[];
}

export default function Education({ education }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="education"
      className="relative max-w-4xl mx-auto px-6 pb-24 pt-4 z-10"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.4em] text-muted-foreground uppercase">
          <h1 className="text-muted-foreground font-bold text-xl">
            <span className="text-muted-foreground/40">{"// "}</span>
            Academic Journey
          </h1>
        </div>

        <div className="relative border-l-2 border-foreground/25 ml-3 pl-12 space-y-16">
          {education.map(edu => (
            <motion.div
              key={edu.documentId}
              variants={itemVariants}
              className="relative group space-y-4"
            >
              <div className="absolute -left-[54px] top-1.5 w-4 h-4 bg-background border-2 border-foreground group-hover:bg-foreground transition-all duration-300 z-10" />

              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-foreground transition-colors tracking-tight italic">
                  {edu.school}
                </h3>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  [ {edu.duration} ]
                </span>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                <Badge
                  variant="outline"
                  className="rounded-none px-2 py-0.5 border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground transition-all whitespace-normal h-auto"
                >
                  {edu.degree}
                </Badge>
                {edu.track && (
                  <span className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 leading-relaxed">
                    {"// "}
                    {edu.track}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
