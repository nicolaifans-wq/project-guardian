import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VisualSectionEditorProps {
  section: any;
  onUpdate: (sectionId: string, data: any) => void;
}

export const VisualSectionEditor = ({ section, onUpdate }: VisualSectionEditorProps) => {
  const [sectionData, setSectionData] = useState(section?.section_data || {});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setSectionData(section?.section_data || {});
  }, [section]);

  const handleChange = (key: string, value: any) => {
    const newData = { ...sectionData, [key]: value };
    setSectionData(newData);
    onUpdate(section.id, newData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      handleChange('image_url', publicUrl);
      toast.success('Изображение загружено');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  if (!section) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Выберите секцию для редактирования
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Редактирование: {section.section_type}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {['hero', 'text', 'cta'].includes(section.section_type) && (
          <>
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input
                value={sectionData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Введите заголовок"
              />
            </div>
            <div className="space-y-2">
              <Label>Размер заголовка: {sectionData.titleSize || 48}px</Label>
              <Slider
                value={[parseInt(sectionData.titleSize) || 48]}
                onValueChange={([value]) => handleChange('titleSize', `${value}px`)}
                min={24}
                max={96}
                step={2}
              />
            </div>
          </>
        )}

        {['hero', 'cta'].includes(section.section_type) && (
          <>
            <div className="space-y-2">
              <Label>Подзаголовок/Описание</Label>
              <Textarea
                value={sectionData.subtitle || sectionData.description || ''}
                onChange={(e) => handleChange(section.section_type === 'hero' ? 'subtitle' : 'description', e.target.value)}
                placeholder="Введите текст"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Размер текста: {sectionData.subtitleSize || sectionData.descriptionSize || 20}px</Label>
              <Slider
                value={[parseInt(sectionData.subtitleSize || sectionData.descriptionSize) || 20]}
                onValueChange={([value]) => handleChange(
                  section.section_type === 'hero' ? 'subtitleSize' : 'descriptionSize',
                  `${value}px`
                )}
                min={14}
                max={48}
                step={2}
              />
            </div>
          </>
        )}

        {section.section_type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Контент</Label>
              <Textarea
                value={sectionData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Введите текст"
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Размер текста: {sectionData.contentSize || 16}px</Label>
              <Slider
                value={[parseInt(sectionData.contentSize) || 16]}
                onValueChange={([value]) => handleChange('contentSize', `${value}px`)}
                min={12}
                max={32}
                step={1}
              />
            </div>
          </>
        )}

        {['hero', 'image'].includes(section.section_type) && (
          <div className="space-y-2">
            <Label>Изображение</Label>
            <div className="flex gap-2">
              <Input
                value={sectionData.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="URL изображения"
              />
              <Label htmlFor={`upload-${section.id}`} className="cursor-pointer">
                <Button type="button" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </span>
                </Button>
              </Label>
              <input
                id={`upload-${section.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {sectionData.image_url && (
              <img
                src={sectionData.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg mt-2"
              />
            )}
          </div>
        )}

        {['hero', 'cta'].includes(section.section_type) && (
          <>
            <div className="space-y-2">
              <Label>Текст кнопки</Label>
              <Input
                value={sectionData.button_text || ''}
                onChange={(e) => handleChange('button_text', e.target.value)}
                placeholder="Текст кнопки"
              />
            </div>
            <div className="space-y-2">
              <Label>Ссылка кнопки</Label>
              <Input
                value={sectionData.button_url || ''}
                onChange={(e) => handleChange('button_url', e.target.value)}
                placeholder="/catalog"
              />
            </div>
          </>
        )}

        {section.section_type === 'image' && (
          <div className="space-y-2">
            <Label>Alt текст</Label>
            <Input
              value={sectionData.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Описание изображения"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
