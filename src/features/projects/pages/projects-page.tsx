import type { StrapiProject } from "@/lib/strapi";
import ProjectGrid from "../components/project-grid";
import { SectionLayout } from "#/components/layout/section-layout";

interface Props {
  projects: StrapiProject[];
}

export default function ProjectsPage({ projects }: Props) {
  return (
    <SectionLayout number="04" title="Featured Projects">
      <ProjectGrid projects={projects} />
    </SectionLayout>
  );
}
