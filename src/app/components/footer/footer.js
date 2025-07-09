export default function Footer() {
    return (
        <footer className="w-full py-3 px-6 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-2 md:mb-0">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
                    <span className="text-sm font-medium">Salesianos Zaragoza</span>
                </div>
                <div className="text-xs text-white/90">
                    ©2025 Salesianos Zaragoza - Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};