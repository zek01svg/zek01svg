import { createFileRoute } from "@tanstack/react-router";
import { fetchProjects } from "@/lib/strapi";
import ProjectsPage from "@/features/projects/pages/projects-page";

export const Route = createFileRoute("/projects")({
  loader: () => fetchProjects(),
  component: function ProjectsRoute() {
    const projects = Route.useLoaderData();
    return <ProjectsPage projects={projects} />;
  },
});
