"use client";


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
  return (
    <>
      <ScrollProgress />
      <Header />
      {/* overflow-x-clip contains decorative glows/aurora that extend past the
          viewport, preventing sideways scroll on mobile. `clip` doesn't create a
          scroll container, so sticky positioning inside still works. */}
      <main className="overflow-x-clip">{children}</main>
      <Footer />
      <CustomerServiceButton />
      <DeferredEffects />
    </>
  );
}
