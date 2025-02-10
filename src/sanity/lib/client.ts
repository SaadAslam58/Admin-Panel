import { createClient } from "next-sanity";

// Debugging: Print API token to check if it's loaded
console.log("Sanity API Token (Admin Panel):", process.env.SANITY_API_TOKEN ? "Loaded ✅" : "Not Loaded ❌");

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-10",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "", // Ensure token is used
});
