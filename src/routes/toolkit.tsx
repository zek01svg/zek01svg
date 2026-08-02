import { createFileRoute } from "@tanstack/react-router";
import { fetchToolkit } from "@/lib/strapi";
import ToolkitPage from "@/features/toolkit/pages/toolkit-page";

export const Route = createFileRoute("/toolkit")({
  loader: () => fetchToolkit(),
  component: function ToolkitRoute() {
    const toolkit = Route.useLoaderData();
    return <ToolkitPage toolkit={toolkit} />;
  },
});
