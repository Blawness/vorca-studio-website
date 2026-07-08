import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Layanan Web Development — Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Layanan", title: "Landing page, company profile, hingga custom web app" });
}
