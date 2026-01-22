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
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索图纸..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={difficulty === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty(null)}
          >
            全部
          </Button>
          <Button
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('easy')}
          >
            简单
          </Button>
          <Button
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('medium')}
          >
            中等
          </Button>
          <Button
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('hard')}
          >
            困难
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        共 {filteredBlueprints.length} 个图纸
      </p>

      {/* Grid */}
      {filteredBlueprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">没有找到图纸</h3>
          <p className="text-sm text-muted-foreground">
            {search || difficulty ? '尝试调整搜索条件' : '还没有图纸，开始创建吧！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBlueprints.map((blueprint) => (
            <BlueprintCard key={blueprint.id} blueprint={blueprint} />
          ))}
        </div>
      )}
    </div>
  );
}
