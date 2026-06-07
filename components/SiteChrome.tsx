"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerServiceButton from "@/components/CustomerServiceButton";
import ScrollProgress from "@/components/effects/ScrollProgress";
import DeferredEffects from "@/components/effects/DeferredEffects";

/**
 * Renders the public marketing chrome (header, footer, WhatsApp button) for
 * site pages, but NOT for /admin routes — admin-kit ships its own shell and a
 * light theme that breaks under the marketing layout's bg-black/text-white.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // admin-kit ships a light theme: give it a solid light canvas and reset the
    // inherited white text so its UI is readable.
    return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
  }

  return (
    <>
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <CustomerServiceButton />
      <DeferredEffects />
    </>
  );
}
