import type { StrapiToolkit } from "@/lib/strapi";
import ToolkitGrid from "../components/toolkit-grid";
import { SectionLayout } from "#/components/layout/section-layout";

interface Props {
  toolkit: StrapiToolkit;
}

export default function ToolkitPage({ toolkit }: Props) {
  return (
    <SectionLayout number="03" title="Technical Toolkit">
      <ToolkitGrid toolkit={toolkit} />
    </SectionLayout>
  );
}
