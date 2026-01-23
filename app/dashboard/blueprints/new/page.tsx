import { BlueprintForm } from '@/components/blueprints/blueprint-form';

export default function NewBlueprintPage() {
  return (
    <div className="container mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">创建图纸</h2>
        <p className="text-sm text-muted-foreground">
          添加新的拼豆图纸到您的图纸库
        </p>
      </div>

      <BlueprintForm mode="create" />
    </div>
  );
}
