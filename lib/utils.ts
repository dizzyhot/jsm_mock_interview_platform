import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, mappings } from "@/constants";

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

// Firebase initialization check utilities
export const checkFirebaseAdminInit = () => {
  try {
    // Check if environment variables are set
    const hasServiceAccount =
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY;

    const hasProjectId = process.env.FIREBASE_PROJECT_ID;

    return {
      isInitialized: true,
      hasServiceAccount,
      hasProjectId,
      projectId: process.env.FIREBASE_PROJECT_ID || "Not set",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "Set" : "Not set",
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? "Set" : "Not set",
    };
  } catch (error) {
    return {
      isInitialized: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const checkFirebaseClientInit = () => {
  try {
    const { getApps } = require("firebase/app");
    const apps = getApps();

    return {
      isInitialized: apps.length > 0,
      appCount: apps.length,
      apps: apps.map((app: any) => ({
        name: app.name,
        options: app.options,
      })),
    };
  } catch (error) {
    return {
      isInitialized: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const validateFirebaseConfig = () => {
  const adminCheck = checkFirebaseAdminInit();
  const clientCheck = checkFirebaseClientInit();

  return {
    admin: adminCheck,
    client: clientCheck,
    isValid: adminCheck.isInitialized && clientCheck.isInitialized,
  };
};
