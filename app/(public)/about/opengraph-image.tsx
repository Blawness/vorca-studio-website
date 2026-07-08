import { renderOgImage, size, contentType } from "@/lib/og";

export const alt = "Tentang Vorca Studio";
export { size, contentType };

export default function Image() {
    return renderOgImage({ eyebrow: "Tentang", title: "Web development agency untuk bisnis Indonesia" });
}
