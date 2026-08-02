import { createFileRoute } from "@tanstack/react-router";
import { fetchExperiences } from "@/lib/strapi";
import ExperiencePage from "@/features/experience/pages/experience-page";

export const Route = createFileRoute("/experience")({
  loader: () => fetchExperiences(),
  component: function ExperienceRoute() {
    const experiences = Route.useLoaderData();
    return <ExperiencePage experiences={experiences} />;
  },
});
