import { BlueprintForm } from '@/components/blueprints/blueprint-form';

export default function NewBlueprintPage() {
  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">创建图纸</h1>
        <p className="text-muted-foreground">
          添加新的拼豆图纸到您的图纸库
        </p>
      </div>

      <BlueprintForm mode="create" />
    </div>
  );
}
