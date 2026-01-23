'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  userName?: string;
}

export function AvatarUpload({
  value,
  onChange,
  disabled = false,
  userName,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (2MB for avatars)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Preview */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32 border-4 border-muted">
          <AvatarImage src={value || undefined} alt={userName || 'User'} />
          <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
            {userName ? userName.charAt(0).toUpperCase() : <User className="h-12 w-12" />}
          </AvatarFallback>
        </Avatar>

        {/* Upload Button */}
        <div className="flex flex-col items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            size="sm"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {value ? '更换头像' : '上传头像'}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            支持 JPG, PNG, GIF, WebP<br />
            最大 2MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
