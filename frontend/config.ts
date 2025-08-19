// Configuration file for the frontend application

// The Clerk publishable key, to initialize Clerk authentication.
// TODO: Set this to your Clerk publishable key, which can be found in the Clerk dashboard.
export const clerkPublishableKey = "";

// API base URL for backend services
export const apiBaseUrl = process.env.NODE_ENV === "production" 
  ? "https://your-production-api.com" 
  : "http://localhost:4000";

// Contact email for the company
export const contactEmail = "hello@vorca.studio";

// Company social media links
export const socialLinks = {
  instagram: "https://instagram.com/vorcastudio",
  linkedin: "https://linkedin.com/company/vorcastudio",
  github: "https://github.com/vorcastudio",
};

// Google Analytics tracking ID
// TODO: Replace with your actual Google Analytics tracking ID
export const googleAnalyticsId = "";

// Calendly link for scheduling consultations
// TODO: Replace with your actual Calendly link
export const calendlyLink = "https://calendly.com/vorcastudio/consultation";
