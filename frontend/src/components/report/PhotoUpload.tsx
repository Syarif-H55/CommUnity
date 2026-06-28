'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoItem {
    id?: string;
    file?: File;
    preview: string;
    isExisting?: boolean;
}

interface PhotoUploadProps {
    photos: PhotoItem[];
    onAdd: (files: File[]) => void;
    onRemove: (index: number) => void;
    maxPhotos?: number;
    disabled?: boolean;
    error?: string;
}

export function PhotoUpload({ photos, onAdd, onRemove, maxPhotos = 5, disabled, error }: PhotoUploadProps) {
    const canAddMore = photos.length < maxPhotos;

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onAdd(files);
        }
        e.target.value = '';
    }, [onAdd]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                    Foto Dokumentasi
                    <span className="text-xs text-muted-foreground ml-2">
                        ({photos.length}/{maxPhotos})
                    </span>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo, index) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                        <img
                            src={photo.preview}
                            alt={`Foto ${index + 1}`}
                            className="size-full object-cover"
                        />
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                ))}

                {canAddMore && !disabled && (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 text-muted-foreground transition-colors hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:border-emerald-600/50 dark:hover:bg-emerald-950/20">
                        <ImagePlus className="size-6" />
                        <span className="text-xs font-medium">Tambah Foto</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {error && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5" />
                    {error}
                </p>
            )}

            <p className="text-xs text-muted-foreground">
                Format: JPG, JPEG, PNG. Maksimal 5MB per foto. Minimal 1 foto.
            </p>
        </div>
    );
}

export type { PhotoItem };
