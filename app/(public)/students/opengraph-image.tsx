import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Jasa Tugas & Project Mahasiswa — Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Mahasiswa", title: "Bantuan tugas kuliah, project web, dan UI/UX" });
}
