import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface FileManagerProps {
  onImageSelect?: (url: string) => void;
}

export const FileManager = ({ onImageSelect }: FileManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите файл изображения');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrl);
      toast.success('Изображение успешно загружено!');
      
      if (onImageSelect) {
        onImageSelect(publicUrl);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    toast.success('URL скопирован в буфер обмена');
    setTimeout(() => setCopied(false), 2000);
  };

  const clearUpload = () => {
    setUploadedUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Файловый менеджер</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>

        {uploadedUrl && (
          <div className="space-y-2">
            <div className="relative">
              <img 
                src={uploadedUrl} 
                alt="Uploaded" 
                className="w-full max-h-48 object-contain rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input value={uploadedUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>• Максимальный размер файла: 5MB</p>
          <p>• Поддерживаемые форматы: JPG, PNG, GIF, WebP</p>
        </div>
      </CardContent>
    </Card>
  );
};
