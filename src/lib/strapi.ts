import { createServerFn } from "@tanstack/react-start";
import { env } from "@/env";

// Manual types — replace by running:
//   bunx @strapi/client generate-types --url $STRAPI_URL --token $STRAPI_API_TOKEN

export interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  role: string;
  duration: string;
  summary?: string | null;
  description: string[];
  techStack: string[];
  githubLink?: string | null;
  liveLink?: string | null;
  category?: string | null;
}

export interface StrapiExperience {
  id: number;
  documentId: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  bullets?: string[] | null;
}

export interface StrapiEducation {
  id: number;
  documentId: string;
  school: string;
  degree: string;
  track?: string | null;
  duration: string;
}
// rAyuaV5qvxtes7Ev
export interface StrapiUserProfile {
  id: number;
  documentId: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface StrapiToolkit {
  id: number;
  documentId: string;
  languages: string[];
  cloud: string[];
  frameworks: string[];
  concepts: string[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${env.STRAPI_URL}/api/${path}`, {
    headers: {
      Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${path} — ${res.status} ${res.statusText}`
    );
  }
  return res.json() as Promise<T>;
}

export const fetchProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiProject[] }>(
      "projects?sort=publishedAt:desc&pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 projects — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchExperiences = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiExperience[] }>(
      "experiences?pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 experiences — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchEducation = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiEducation[] }>(
      "educations?sort=publishedAt:asc&pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 education entries — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchUserProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiUserProfile | null }>(
      "user-profile"
    );
    if (!data) {
      throw new Error(
        "Strapi UserProfile not configured — add data in Strapi admin"
      );
    }
    return data;
  }
);

export const fetchToolkit = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiToolkit | null }>("toolkit");
    if (!data) {
      throw new Error(
        "Strapi Toolkit not configured — add data in Strapi admin"
      );
    }
    return data;
  }
);
