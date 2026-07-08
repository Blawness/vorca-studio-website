import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Kontak & Konsultasi Gratis — Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Kontak", title: "Konsultasi gratis untuk kebutuhan web Anda" });
}
