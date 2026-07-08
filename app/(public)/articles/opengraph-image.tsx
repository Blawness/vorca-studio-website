import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Artikel & Insight Web Development — Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Artikel", title: "Insight web development, UI/UX, dan bisnis digital" });
}
