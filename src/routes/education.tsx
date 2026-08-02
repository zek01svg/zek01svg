import { createFileRoute } from "@tanstack/react-router";
import { fetchEducation } from "@/lib/strapi";
import EducationPage from "@/features/education/pages/education-page";

export const Route = createFileRoute("/education")({
  loader: () => fetchEducation(),
  component: function EducationRoute() {
    const education = Route.useLoaderData();
    return <EducationPage education={education} />;
  },
});
