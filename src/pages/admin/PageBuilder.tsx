import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save, Plus, GripVertical, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionEditor } from '@/components/admin/SectionEditor';
import { ThemeEditor } from '@/components/admin/ThemeEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PageSection {
  id: string;
  section_type: string;
  section_data: any;
  sort_order: number;
  is_active: boolean;
}

interface SortableItemProps {
  id: string;
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (id: string) => void;
}

const SortableItem = ({ id, section, onEdit, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h4 className="font-medium">{section.section_type}</h4>
          <p className="text-sm text-muted-foreground">
            Порядок: {section.sort_order}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onEdit(section)}>
          Редактировать
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(section.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

const PageBuilder = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [showSectionEditor, setShowSectionEditor] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin && pageId && pageId !== 'new') {
      loadPage();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, pageId]);

  const loadPage = async () => {
    try {
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (pageError) throw pageError;

      setTitle(pageData.title);
      setSlug(pageData.slug);
      setMetaDescription(pageData.meta_description || '');

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);
    } catch (error: any) {
      console.error('Error loading page:', error);
      toast.error('Ошибка при загрузке страницы');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error('Заполните название и URL страницы');
      return;
    }

    setSaving(true);
    try {
      if (pageId === 'new') {
        const { data, error } = await supabase
          .from('pages')
          .insert({
            title,
            slug,
            meta_description: metaDescription,
          })
          .select()
          .single();

        if (error) throw error;
        toast.success('Страница создана');
        navigate(`/admin/pages/${data.id}`);
      } else {
        const { error } = await supabase
          .from('pages')
          .update({
            title,
            slug,
            meta_description: metaDescription,
          })
          .eq('id', pageId);

        if (error) throw error;
        toast.success('Страница сохранена');
      }
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast.error('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        sort_order: idx,
      }));

      setSections(newSections);

      try {
        for (const section of newSections) {
          await supabase
            .from('page_sections')
            .update({ sort_order: section.sort_order })
            .eq('id', section.id);
        }
        toast.success('Порядок секций обновлен');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Ошибка при изменении порядка');
      }
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setShowSectionEditor(true);
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
    setShowSectionEditor(true);
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      toast.success('Секция удалена');
      loadPage();
    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast.error('Ошибка при удалении секции');
    }
  };

  const handleSaveSection = async (sectionData: any) => {
    if (!pageId || pageId === 'new') {
      toast.error('Сначала сохраните страницу');
      return;
    }

    try {
      if (editingSection) {
        const { error } = await supabase
          .from('page_sections')
          .update(sectionData)
          .eq('id', editingSection.id);

        if (error) throw error;
        toast.success('Секция обновлена');
      } else {
        const { error } = await supabase
          .from('page_sections')
          .insert({
            ...sectionData,
            page_id: pageId,
            sort_order: sections.length,
          });

        if (error) throw error;
        toast.success('Секция добавлена');
      }
      setShowSectionEditor(false);
      loadPage();
    } catch (error: any) {
      console.error('Error saving section:', error);
      toast.error('Ошибка при сохранении секции');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-8 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <Link to="/admin/pages">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                К списку страниц
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">
                {pageId === 'new' ? 'Новая страница' : 'Редактор страницы'}
              </h1>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Сохранить
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Контент</TabsTrigger>
                <TabsTrigger value="sections" disabled={pageId === 'new'}>
                  Секции
                </TabsTrigger>
                <TabsTrigger value="theme">Тема</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Основные настройки</CardTitle>
                    <CardDescription>
                      Настройте название и URL страницы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название страницы</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Главная страница"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL (slug)</Label>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="home"
                      />
                      <p className="text-sm text-muted-foreground">
                        Страница будет доступна по адресу: /{slug}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta">Мета-описание (SEO)</Label>
                      <Textarea
                        id="meta"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Описание страницы для поисковых систем"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Секции страницы</CardTitle>
                        <CardDescription>
                          Перетаскивайте секции для изменения порядка
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить секцию
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={sections.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {sections.map((section) => (
                          <SortableItem
                            key={section.id}
                            id={section.id}
                            section={section}
                            onEdit={handleEditSection}
                            onDelete={handleDeleteSection}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>

                    {sections.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                          Пока нет секций на этой странице
                        </p>
                        <Button onClick={handleAddSection}>
                          <Plus className="mr-2 h-4 w-4" />
                          Добавить первую секцию
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="mt-6">
                <ThemeEditor />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      {showSectionEditor && (
        <SectionEditor
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => setShowSectionEditor(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default PageBuilder;
