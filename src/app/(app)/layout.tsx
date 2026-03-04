import { Sidebar } from "@/components/dashboard/sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {children}
        </div>
    );
}
