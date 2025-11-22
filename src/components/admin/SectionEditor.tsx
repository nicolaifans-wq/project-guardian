import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';

interface SectionEditorProps {
  section: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero секция' },
  { value: 'text', label: 'Текстовый блок' },
  { value: 'image', label: 'Изображение' },
  { value: 'cards', label: 'Карточки' },
  { value: 'products', label: 'Товары' },
  { value: 'cta', label: 'Призыв к действию' },
];

export const SectionEditor = ({ section, onSave, onClose }: SectionEditorProps) => {
  const [sectionType, setSectionType] = useState(section?.section_type || 'text');
  const [sectionData, setSectionData] = useState(section?.section_data || {});
  const [uploading, setUploading] = useState(false);

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

      setSectionData({ ...sectionData, image_url: publicUrl });
      toast.success('Изображение загружено');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      section_type: sectionType,
      section_data: sectionData,
      is_active: true,
    });
  };

  const updateData = (key: string, value: any) => {
    setSectionData({ ...sectionData, [key]: value });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Редактировать секцию' : 'Добавить секцию'}
          </DialogTitle>
          <DialogDescription>
            Настройте содержимое и внешний вид секции
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Тип секции</Label>
            <Select value={sectionType} onValueChange={setSectionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sectionType === 'hero' && (
            <>
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={sectionData.title || ''}
                  onChange={(e) => updateData('title', e.target.value)}
                  placeholder="Тепло и комфорт для вашего дома"
                />
              </div>
              <div className="space-y-2">
                <Label>Подзаголовок</Label>
                <Textarea
                  value={sectionData.subtitle || ''}
                  onChange={(e) => updateData('subtitle', e.target.value)}
                  placeholder="Современное отопительное оборудование"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Изображение</Label>
                <div className="flex gap-2">
                  <Input
                    value={sectionData.image_url || ''}
                    onChange={(e) => updateData('image_url', e.target.value)}
                    placeholder="URL изображения"
                  />
                  <Label htmlFor="hero-image" className="cursor-pointer">
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
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Текст кнопки</Label>
                <Input
                  value={sectionData.button_text || ''}
                  onChange={(e) => updateData('button_text', e.target.value)}
                  placeholder="Посмотреть каталог"
                />
              </div>
              <div className="space-y-2">
                <Label>Ссылка кнопки</Label>
                <Input
                  value={sectionData.button_url || ''}
                  onChange={(e) => updateData('button_url', e.target.value)}
                  placeholder="/catalog"
                />
              </div>
            </>
          )}

          {sectionType === 'text' && (
            <>
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={sectionData.title || ''}
                  onChange={(e) => updateData('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Текст</Label>
                <Textarea
                  value={sectionData.content || ''}
                  onChange={(e) => updateData('content', e.target.value)}
                  rows={6}
                />
              </div>
            </>
          )}

          {sectionType === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Изображение</Label>
                <div className="flex gap-2">
                  <Input
                    value={sectionData.image_url || ''}
                    onChange={(e) => updateData('image_url', e.target.value)}
                    placeholder="URL изображения"
                  />
                  <Label htmlFor="section-image" className="cursor-pointer">
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
                    id="section-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alt текст</Label>
                <Input
                  value={sectionData.alt || ''}
                  onChange={(e) => updateData('alt', e.target.value)}
                />
              </div>
            </>
          )}

          {sectionType === 'cta' && (
            <>
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={sectionData.title || ''}
                  onChange={(e) => updateData('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={sectionData.description || ''}
                  onChange={(e) => updateData('description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Текст кнопки</Label>
                <Input
                  value={sectionData.button_text || ''}
                  onChange={(e) => updateData('button_text', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ссылка кнопки</Label>
                <Input
                  value={sectionData.button_url || ''}
                  onChange={(e) => updateData('button_url', e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
