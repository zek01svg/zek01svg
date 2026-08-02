import type { StrapiEducation } from "@/lib/strapi";
import Education from "../components/education";
import { SectionLayout } from "#/components/layout/section-layout";

interface Props {
  education: StrapiEducation[];
}

export default function EducationPage({ education }: Props) {
  return (
    <SectionLayout number="02" title="Academic Journey">
      <Education education={education} />
    </SectionLayout>
  );
}
