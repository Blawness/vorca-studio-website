import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Vorca Studio — Jasa Web Development & Custom Web App Indonesia";
export { size, contentType };

// Default social card. Inherited by every route that does not ship its own
// `openGraph` metadata block (declaring one at a child segment drops the
// parent's resolved images).
export default function Image() {
    return renderOgImage({
        eyebrow: "Web Development Agency",
        title: "Website & custom web app modern untuk bisnis Indonesia",
    });
}
