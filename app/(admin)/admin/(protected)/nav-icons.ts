"use client";

// Re-exporting the Lucide icons through a "use client" boundary turns them
// into client references, so they can be passed as props from the server
// AdminRootLayout down into admin-kit's client AdminSidebar without the
// "Only plain objects can be passed to Client Components" error.
export { FileText, Image, LayoutDashboard, Users } from "lucide-react";
