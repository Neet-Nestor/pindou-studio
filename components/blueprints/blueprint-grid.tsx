'use client';

import { useState } from 'react';
import { Blueprint } from '@/lib/db/schema';
import { BlueprintCard } from './blueprint-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package } from 'lucide-react';

interface BlueprintGridProps {
  blueprints: Blueprint[];
}

export function BlueprintGrid({ blueprints }: BlueprintGridProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const filteredBlueprints = blueprints.filter((blueprint) => {
    const matchesSearch =
      search === '' ||
      blueprint.name.toLowerCase().includes(search.toLowerCase()) ||
      blueprint.description?.toLowerCase().includes(search.toLowerCase()) ||
      blueprint.tags?.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty = !difficulty || blueprint.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索图纸..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-xl border-2 h-11"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={difficulty === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty(null)}
            className="rounded-xl"
          >
            全部
          </Button>
          <Button
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('easy')}
            className="rounded-xl"
          >
            ✨ 简单
          </Button>
          <Button
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('medium')}
            className="rounded-xl"
          >
            ⚡ 中等
          </Button>
          <Button
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('hard')}
            className="rounded-xl"
          >
            🔥 困难
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        找到 <span className="font-semibold text-foreground">{filteredBlueprints.length}</span> 个图纸
      </p>

      {/* Grid */}
      {filteredBlueprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
            <Package className="relative h-16 w-16 text-muted-foreground/60" />
          </div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            没有找到图纸
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {search || difficulty ? '尝试调整搜索条件，或者创建一个新图纸吧！' : '还没有图纸，开始创建你的第一个作品设计吧！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBlueprints.map((blueprint, index) => (
            <div
              key={blueprint.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4"
            >
              <BlueprintCard blueprint={blueprint} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
