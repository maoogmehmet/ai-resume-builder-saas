import { ResumeEditorPage } from "@/components/resume-editor/resume-editor-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ResumeEditorPage />;
}
