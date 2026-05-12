import { Reveal } from "#/components/custom/reveal";

interface SectionLayoutProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export const SectionLayout = ({ children }: SectionLayoutProps) => (
  <main className="min-h-screen relative bg-background text-foreground selection:bg-foreground selection:text-background pt-16 pb-12 w-full flex flex-col items-center">
    <Reveal width="100%">
      <div className="w-full flex flex-col items-center">{children}</div>
    </Reveal>
  </main>
);
