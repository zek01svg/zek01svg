import { createFileRoute } from "@tanstack/react-router";
import EducationPage from "../features/education/pages/education-page";

export const Route = createFileRoute("/education")({
  component: EducationPage,
});
