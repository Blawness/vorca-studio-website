export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#050b16]">
            <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            </div>
        </div>
    );
}
