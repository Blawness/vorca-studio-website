import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerServiceButton() {
    return (
        <motion.a
            href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors duration-300 pr-5 pl-2 py-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1
            }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle size={24} />
            </div>
            <motion.span
                className="font-medium text-sm"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                Konsultasi Sekarang!
            </motion.span>
        </motion.a>
    );
}
