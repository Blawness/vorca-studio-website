"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerServiceButton from "@/components/CustomerServiceButton";

/**
 * Renders the public marketing chrome (header, footer, WhatsApp button) for
 * site pages, but NOT for /admin routes — admin-kit ships its own shell and a
 * light theme that breaks under the marketing layout's bg-black/text-white.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Reset inherited white text so admin-kit's light-themed UI is readable.
    return <div className="text-slate-900">{children}</div>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CustomerServiceButton />
    </>
  );
}
