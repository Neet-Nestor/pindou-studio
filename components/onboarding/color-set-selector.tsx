'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { ColorSet } from '@/lib/db/schema';

interface ColorSetSelectorProps {
  colorSets: ColorSet[];
  userId: string;
}

export default function ColorSetSelector({ colorSets, userId }: ColorSetSelectorProps) {
  const router = useRouter();
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSet = (setId: string) => {
    setSelectedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          colorSetIds: selectedSets,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize inventory');
      }

      router.push('/inventory');
      router.refresh();
    } catch (error) {
      console.error('Error initializing inventory:', error);
      alert('Failed to initialize inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/inventory');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {colorSets.map((set) => (
          <Card
            key={set.id}
            className={`cursor-pointer transition-all ${
              selectedSets.includes(set.id)
                ? 'ring-2 ring-primary'
                : 'hover:border-primary'
            }`}
            onClick={() => handleToggleSet(set.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{set.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {set.brand}
                  </CardDescription>
                </div>
                <Checkbox
                  checked={selectedSets.includes(set.id)}
                  onCheckedChange={() => handleToggleSet(set.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {set.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSkip}
          disabled={isLoading}
        >
          跳过
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedSets.length === 0 || isLoading}
        >
          {isLoading
            ? '加载中...'
            : `继续 (${selectedSets.length})`}
        </Button>
      </div>
    </div>
  );
}
