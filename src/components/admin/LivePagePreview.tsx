import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface LivePagePreviewProps {
  sections: any[];
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string;
}

export const LivePagePreview = ({ sections, onSectionClick, selectedSectionId }: LivePagePreviewProps) => {
  return (
    <div className="space-y-4 bg-background rounded-lg border p-4">
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => onSectionClick?.(section.id)}
          className={`cursor-pointer transition-all ${
            selectedSectionId === section.id
              ? 'ring-2 ring-primary ring-offset-2'
              : 'hover:ring-1 hover:ring-border'
          }`}
        >
          {section.section_type === 'hero' && (
            <div
              className="relative h-96 rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                backgroundImage: section.section_data.image_url
                  ? `url(${section.section_data.image_url})`
                  : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-center text-white px-4">
                <h1 className="text-5xl font-bold mb-4" style={{ fontSize: section.section_data.titleSize || '3rem' }}>
                  {section.section_data.title || 'Заголовок Hero'}
                </h1>
                <p className="text-xl mb-6" style={{ fontSize: section.section_data.subtitleSize || '1.25rem' }}>
                  {section.section_data.subtitle || 'Подзаголовок'}
                </p>
                {section.section_data.button_text && (
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
                    {section.section_data.button_text}
                  </button>
                )}
              </div>
            </div>
          )}

          {section.section_type === 'text' && (
            <div className="p-8 bg-card rounded-lg">
              <h2 className="text-3xl font-bold mb-4" style={{ fontSize: section.section_data.titleSize || '1.875rem' }}>
                {section.section_data.title || 'Заголовок текстового блока'}
              </h2>
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: section.section_data.contentSize || '1rem' }}>
                {section.section_data.content || 'Текстовый контент'}
              </p>
            </div>
          )}

          {section.section_type === 'image' && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={section.section_data.image_url || '/placeholder.svg'}
                alt={section.section_data.alt || 'Изображение'}
                className="w-full h-auto"
              />
            </div>
          )}

          {section.section_type === 'cta' && (
            <div className="p-12 bg-gradient-to-br from-primary to-accent rounded-lg text-center text-white">
              <h2 className="text-4xl font-bold mb-4" style={{ fontSize: section.section_data.titleSize || '2.25rem' }}>
                {section.section_data.title || 'Призыв к действию'}
              </h2>
              <p className="text-xl mb-6 opacity-90" style={{ fontSize: section.section_data.descriptionSize || '1.25rem' }}>
                {section.section_data.description || 'Описание'}
              </p>
              {section.section_data.button_text && (
                <button className="px-8 py-4 bg-white text-primary rounded-lg font-medium hover:shadow-lg transition-shadow">
                  {section.section_data.button_text}
                </button>
              )}
            </div>
          )}

          {section.section_type === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-card rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">Карточка {i}</h3>
                  <p className="text-muted-foreground">Контент карточки</p>
                </div>
              ))}
            </div>
          )}

          {section.section_type === 'products' && (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Товары</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-lg border overflow-hidden">
                    <div className="aspect-square bg-muted" />
                    <div className="p-3">
                      <p className="font-medium">Товар {i}</p>
                      <p className="text-sm text-muted-foreground">Цена</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {sections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Добавьте секции для отображения превью
        </div>
      )}
    </div>
  );
};
