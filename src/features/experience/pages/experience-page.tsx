import type { StrapiExperience } from "@/lib/strapi";
import Experience from "../components/experience";
import { SectionLayout } from "#/components/layout/section-layout";

interface Props {
  experiences: StrapiExperience[];
}

export default function ExperiencePage({ experiences }: Props) {
  return (
    <SectionLayout number="01" title="Professional Experience">
      <Experience experiences={experiences} />
    </SectionLayout>
  );
}
