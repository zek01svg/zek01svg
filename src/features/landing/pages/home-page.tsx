import type { StrapiUserProfile } from "@/lib/strapi";
import Hero from "../components/hero";

interface Props {
  profile: StrapiUserProfile;
}

export default function HomePage({ profile }: Props) {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background selection:bg-foreground selection:text-background text-foreground">
      <div className="relative z-10 flex flex-col items-center">
        <section className="w-full">
          <Hero profile={profile} />
        </section>
      </div>
    </main>
  );
}
