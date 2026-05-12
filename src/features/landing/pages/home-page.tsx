import Hero from "../components/hero";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background selection:bg-foreground selection:text-background text-foreground">
      <div className="relative z-10 flex flex-col items-center">
        <section className="w-full">
          <Hero />
        </section>
      </div>
    </main>
  );
}
