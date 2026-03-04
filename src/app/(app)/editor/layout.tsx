export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 overflow-hidden bg-zinc-50 relative">
            {children}
        </main>
    );
}
