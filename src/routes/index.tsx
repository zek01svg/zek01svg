import { createFileRoute } from "@tanstack/react-router";
import { fetchUserProfile } from "@/lib/strapi";
import HomePage from "@/features/landing/pages/home-page";

export const Route = createFileRoute("/")({
  loader: () => fetchUserProfile(),
  component: function HomeRoute() {
    const profile = Route.useLoaderData();
    return <HomePage profile={profile} />;
  },
});
