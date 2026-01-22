'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Blueprint } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/upload/image-upload';
import { PieceRequirementsInput } from './piece-requirements-input';
import { Loader2 } from 'lucide-react';

interface BlueprintFormProps {
  blueprint?: Blueprint;
  mode: 'create' | 'edit';
}

export function BlueprintForm({ blueprint, mode }: BlueprintFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(blueprint?.name || '');
  const [description, setDescription] = useState(blueprint?.description || '');
  const [imageUrls, setImageUrls] = useState<string[]>(
    blueprint?.imageUrl ? [blueprint.imageUrl] : []
  );
  const [difficulty, setDifficulty] = useState(blueprint?.difficulty || '');
  const [pieceRequirements, setPieceRequirements] = useState<Record<string, number>>(
    blueprint?.pieceRequirements ? JSON.parse(blueprint.pieceRequirements) : {}
  );
  const [tags, setTags] = useState(blueprint?.tags || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        imageUrl: imageUrls[0] || '',
        difficulty: difficulty || undefined,
        pieceRequirements,
        tags,
      };

      const url = mode === 'create'
        ? '/api/blueprints/create'
        : `/api/blueprints/${blueprint?.id}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save blueprint');
      }

      const data = await response.json();
      router.push(`/dashboard/blueprints/${data.blueprint.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">名称 *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入图纸名称"
          required
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入图纸描述"
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>预览图</Label>
        <ImageUpload
          maxImages={1}
          value={imageUrls}
          onChange={setImageUrls}
          disabled={loading}
        />
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label htmlFor="difficulty">难度</Label>
        <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="选择难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">简单</SelectItem>
            <SelectItem value="medium">中等</SelectItem>
            <SelectItem value="hard">困难</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Piece Requirements */}
      <div className="space-y-2">
        <Label>颗粒需求</Label>
        <PieceRequirementsInput
          value={pieceRequirements}
          onChange={setPieceRequirements}
          disabled={loading}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">标签</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="用逗号分隔多个标签"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          例如: 动物, 卡通, 简单
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : mode === 'create' ? (
            '创建图纸'
          ) : (
            '保存更改'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
