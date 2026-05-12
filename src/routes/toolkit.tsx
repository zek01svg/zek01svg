import { createFileRoute } from "@tanstack/react-router";
import ToolkitPage from "../features/toolkit/pages/toolkit-page";

export const Route = createFileRoute("/toolkit")({
  component: ToolkitPage,
});
