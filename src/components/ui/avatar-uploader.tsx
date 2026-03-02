import React, { useRef } from 'react';

export function AvatarUploader({ children, onUpload }: { children: React.ReactNode, onUpload: (file: File) => Promise<{ success: boolean }> }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await onUpload(e.target.files[0]);
        }
    };

    return (
        <div onClick={() => inputRef.current?.click()} className="inline-block relative">
            {children}
            <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleChange} />
        </div>
    );
}
