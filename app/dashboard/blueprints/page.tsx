'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BlueprintGrid } from '@/components/blueprints/blueprint-grid';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Blueprint } from '@/lib/db/schema';

type FilterTab = 'all' | 'my';

export default function BlueprintsPage() {
  const { data: session } = useSession();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    try {
      const response = await fetch('/api/blueprints/list');
      if (!response.ok) throw new Error('Failed to fetch blueprints');
      const data = await response.json();
      setBlueprints(data.blueprints);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlueprints = activeTab === 'all'
    ? blueprints
    : blueprints.filter(bp => bp.createdBy === session?.user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            图纸库
          </h1>
          <p className="text-muted-foreground">
            共 <span className="font-semibold text-foreground">{filteredBlueprints.length}</span> 个图纸
          </p>
        </div>
        <Link href="/dashboard/blueprints/new">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="mr-2 h-5 w-5" />
            添加图纸
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'all'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          全部图纸
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'my'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          我的图纸
          {activeTab === 'my' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <BlueprintGrid blueprints={filteredBlueprints} />
    </div>
  );
}
