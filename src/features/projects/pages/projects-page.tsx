import ProjectGrid from "../components/project-grid";
import { SectionLayout } from "#/components/layout/section-layout";

export default function ProjectsPage() {
  return (
    <SectionLayout number="04" title="Featured Projects">
      <ProjectGrid />
    </SectionLayout>
  );
}
