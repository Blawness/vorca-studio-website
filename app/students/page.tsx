import type { Metadata } from "next";
import StudentsPage from "@/views/StudentsPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: { absolute: "Jasa Tugas & Project Mahasiswa | Vorca Studio" },
    description:
        "Bantuan tugas kuliah, project web, dan UI/UX untuk mahasiswa dengan harga terjangkau, pengerjaan cepat, dan penjelasan kode. Konsultasi gratis 30 menit.",
};

export default function Page() {
    return <StudentsPage />;
}
