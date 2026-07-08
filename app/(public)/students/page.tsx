import type { Metadata } from "next";
import StudentsPage from "@/views/StudentsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Jasa Tugas & Project Mahasiswa | Vorca Studio",
    description:
        "Bantuan tugas kuliah, project web, dan UI/UX untuk mahasiswa dengan harga terjangkau, pengerjaan cepat, dan penjelasan kode. Konsultasi gratis 30 menit.",
    path: "/students",
});

export default function Page() {
    return <StudentsPage />;
}
