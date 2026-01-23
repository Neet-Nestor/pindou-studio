import { Wand2, Sparkles, Palette, Grid3x3, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function BuilderPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-6 py-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
          <Wand2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          图纸生成器
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          使用智能工具轻松创建和设计拼豆图纸
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-12 text-center space-y-6">
          <div className="relative inline-block">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">即将推出</h2>
            <p className="text-muted-foreground">
              我们正在开发强大的图纸生成工具，敬请期待！
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planned Features */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">网格编辑器</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              直观的网格界面，支持拖拽和点击操作，轻松绘制像素图案
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">颜色选择器</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              从291+丰富色库中选择颜色，智能匹配库存中的颜色
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">实时预览</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              实时查看设计效果，自动计算所需颗粒数量
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">图片转换</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              上传图片自动转换为拼豆图纸，AI辅助优化设计
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="bg-muted/50 border-0">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <span className="font-medium">提示：</span>在此功能完成之前，您可以在图纸库中手动添加图纸，或浏览官方提供的图纸
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
