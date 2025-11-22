import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export const ThemeEditor = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState({
    primary: '210 80% 45%',
    accent: '190 70% 50%',
    background: '210 40% 98%',
    foreground: '210 20% 15%',
  });

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'theme')
        .single();

      if (data && !error) {
        setTheme(data.setting_value as any);
      }
    } catch (error: any) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'theme',
          setting_value: theme,
        });

      if (error) throw error;

      // Update CSS variables
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--foreground', theme.foreground);

      toast.success('Тема сохранена');
    } catch (error: any) {
      console.error('Error saving theme:', error);
      toast.error('Ошибка при сохранении темы');
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (key: string, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Редактор темы</CardTitle>
            <CardDescription>
              Настройте цветовую схему сайта (HSL формат)
            </CardDescription>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Сохранить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Основной цвет (Primary)</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={theme.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                placeholder="210 80% 45%"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${theme.primary})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Формат: H S% L% (например: 210 80% 45%)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Акцентный цвет (Accent)</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={theme.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                placeholder="190 70% 50%"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${theme.accent})` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Фон (Background)</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={theme.background}
                onChange={(e) => updateColor('background', e.target.value)}
                placeholder="210 40% 98%"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${theme.background})` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Текст (Foreground)</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={theme.foreground}
                onChange={(e) => updateColor('foreground', e.target.value)}
                placeholder="210 20% 15%"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${theme.foreground})` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h4 className="font-medium mb-4">Предпросмотр</h4>
          <div
            className="p-6 rounded-lg space-y-4"
            style={{
              backgroundColor: `hsl(${theme.background})`,
              color: `hsl(${theme.foreground})`,
            }}
          >
            <h3 className="text-2xl font-bold">Заголовок страницы</h3>
            <p>Это пример текста с новыми цветами темы.</p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded font-medium"
                style={{
                  backgroundColor: `hsl(${theme.primary})`,
                  color: 'white',
                }}
              >
                Основная кнопка
              </button>
              <button
                className="px-4 py-2 rounded font-medium"
                style={{
                  backgroundColor: `hsl(${theme.accent})`,
                  color: 'white',
                }}
              >
                Акцентная кнопка
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
