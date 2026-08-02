import { motion } from "framer-motion";
import type { StrapiProject } from "@/lib/strapi";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  projects: StrapiProject[];
}

export default function ProjectGrid({ projects }: Props) {
  return (
    <section
      id="projects"
      className="relative max-w-6xl mx-auto px-6 pb-24 pt-4 z-10"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.4em] text-muted-foreground uppercase font-bold">
          <h1 className="text-muted-foreground font-bold text-xl">
            <span className="text-muted-foreground/40">{"// "}</span>
            Featured Projects
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.documentId}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="group relative bg-card/40 backdrop-blur-md border-border rounded-none hover:border-foreground/30 transition-all duration-500 overflow-hidden shadow-none">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 w-full">
                    {project.category && (
                      <CardDescription className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase opacity-80 mb-2">
                        <span className="text-muted-foreground/40">
                          {"// "}
                        </span>
                        {project.category}
                      </CardDescription>
                    )}
                    <CardTitle className="text-3xl font-bold tracking-tighter italic text-foreground transition-colors">
                      {project.title}
                    </CardTitle>

                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex items-center font-mono text-[10px] tracking-tight text-muted-foreground/60 uppercase">
                        [ {project.duration} ]
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="rounded-none px-2 py-0.5 border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground transition-all"
                        >
                          {project.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                {project.summary && (
                  <p className="text-sm text-foreground/75 leading-relaxed font-light">
                    {project.summary}
                  </p>
                )}
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed font-light">
                  {project.description.map((desc, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-muted-foreground/40 font-mono shrink-0">
                        —
                      </span>
                      {desc}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map(tech => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="rounded-none bg-muted/50 px-2.5 py-0.5 border border-border text-[9px] uppercase font-bold tracking-widest text-muted-foreground/70 group-hover:border-foreground/20 transition-all shadow-none"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
