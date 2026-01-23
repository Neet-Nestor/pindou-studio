'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuildHistory, Blueprint } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/upload/image-upload';
import { PieceRequirementsInput } from '@/components/blueprints/piece-requirements-input';
import { Loader2, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface BuildFormProps {
  build?: BuildHistory;
  blueprints?: Blueprint[];
  mode: 'create' | 'edit';
}

export function BuildForm({ build, blueprints = [], mode }: BuildFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(build?.title || '');
  const [description, setDescription] = useState(build?.description || '');
  const [imageUrls, setImageUrls] = useState<string[]>(
    build?.imageUrls ? JSON.parse(build.imageUrls) : []
  );
  const [piecesUsed, setPiecesUsed] = useState<Record<string, number>>(
    build?.piecesUsed ? JSON.parse(build.piecesUsed) : {}
  );
  const [blueprintId, setBlueprintId] = useState(build?.blueprintId || '');
  const [completedAt, setCompletedAt] = useState(
    build?.completedAt
      ? new Date(build.completedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [isPublic, setIsPublic] = useState(build?.isPublic || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        imageUrls,
        piecesUsed,
        blueprintId: blueprintId || undefined,
        completedAt: new Date(completedAt).toISOString(),
        isPublic,
      };

      const url = mode === 'create'
        ? '/api/history/create'
        : `/api/history/${build?.id}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save build');
      }

      const data = await response.json();
      toast.success(mode === 'create' ? '作品已保存' : '作品已更新');
      router.push(`/dashboard/history/${data.build.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">标题 *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入作品标题"
          required
          disabled={loading}
          className="rounded-xl border-2 focus:border-primary transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">描述</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入作品描述"
          rows={3}
          disabled={loading}
          className="rounded-xl border-2 focus:border-primary transition-colors"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">作品照片 *</Label>
        <ImageUpload
          maxImages={5}
          value={imageUrls}
          onChange={setImageUrls}
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          最多可上传 5 张照片
        </p>
      </div>

      {/* Pieces Used */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">使用的颗粒</Label>
        <PieceRequirementsInput
          value={piecesUsed}
          onChange={setPiecesUsed}
          disabled={loading}
        />
      </div>

      {/* Blueprint Link */}
      {blueprints.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="blueprint" className="text-sm font-semibold">关联图纸（可选）</Label>
          <Select value={blueprintId} onValueChange={setBlueprintId} disabled={loading}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="选择图纸" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="">无</SelectItem>
              {blueprints.map((bp) => (
                <SelectItem key={bp.id} value={bp.id}>
                  {bp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Completed At */}
      <div className="space-y-2">
        <Label htmlFor="completedAt" className="text-sm font-semibold">完成时间 *</Label>
        <Input
          id="completedAt"
          type="datetime-local"
          value={completedAt}
          onChange={(e) => setCompletedAt(e.target.value)}
          required
          disabled={loading}
          className="rounded-xl border-2 focus:border-primary transition-colors"
        />
      </div>

      {/* Public Toggle */}
      <div className="flex items-center space-x-3 p-4 rounded-xl border-2 bg-accent/30">
        <Checkbox
          id="isPublic"
          checked={isPublic}
          onCheckedChange={(checked) => setIsPublic(checked as boolean)}
          disabled={loading}
        />
        <div className="flex-1">
          <label
            htmlFor="isPublic"
            className="text-sm font-semibold cursor-pointer flex items-center gap-2"
          >
            <Globe className="h-4 w-4 text-secondary" />
            公开分享作品
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            允许其他用户浏览和欣赏你的作品
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading || !title || imageUrls.length === 0}
          size="lg"
          className="rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-br from-amber-500 to-orange-500"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : mode === 'create' ? (
            '记录作品'
          ) : (
            '保存更改'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          size="lg"
          className="rounded-2xl border-2 hover:bg-accent/50"
        >
          取消
        </Button>
      </div>
    </form>
  );
}
