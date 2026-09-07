import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "@/lib/router";

export default function RootComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
