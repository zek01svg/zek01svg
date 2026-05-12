import { createFileRoute } from "@tanstack/react-router";
import ExperiencePage from "../features/experience/pages/experience-page";

export const Route = createFileRoute("/experience")({
  component: ExperiencePage,
});
