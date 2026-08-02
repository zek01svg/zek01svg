import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { StrapiUserProfile } from "@/lib/strapi";
import { Mail } from "lucide-react";

interface Props {
  profile: StrapiUserProfile;
}

export default function Hero({ profile }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center p-6 pb-28 sm:p-24 sm:pt-28 z-10">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-bold">
            <span className="text-muted-foreground/40">{"// "}</span>
            Aspiring Software & Cloud Engineer
          </div>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-foreground flex flex-col gap-2">
          <span>Charles Isaac</span>
          <span className="text-muted-foreground/20">Velasco.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          I'm a penultimate at{" "}
          <span className="text-foreground font-semibold">
            Singapore Management University - BSc Information Systems
          </span>{" "}
          . I like building backend systems and wiring up cloud infrastructure.
          Still learning, but I take it seriously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-6 pt-4 text-muted-foreground"
        >
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground transition-colors hover:bg-accent rounded-none border border-transparent hover:border-border p-2 w-10 h-10"
          >
            <a href={`mailto:${profile.email}`} title="Email Me">
              <Mail className="w-5 h-5" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground transition-colors hover:bg-accent rounded-none border border-transparent hover:border-border p-2 w-10 h-10"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
                <path d="M9 20a5 5 0 0 1-5-5"></path>
              </svg>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground transition-colors hover:bg-accent rounded-none border border-transparent hover:border-border p-2 w-10 h-10"
          >
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
