import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Portfolio — Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Portfolio", title: "Proyek website & web app yang kami kerjakan" });
}
