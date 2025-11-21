import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { FileManager } from '@/components/admin/FileManager';
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  author_id: string | null;
}

const AdminArticles = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
  });

  useEffect(() => {
    if (!user || (!isAdmin && !isJournalist)) {
      navigate('/');
    }
  }, [user, isAdmin, isJournalist, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isJournalist)) {
      loadArticles();
    }
  }, [user, isAdmin, isJournalist]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast.error('Ошибка при загрузке статей');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const articleData = {
        ...formData,
        author_id: user?.id,
        published_at: new Date().toISOString(),
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast.success('Статья обновлена');
      } else {
        const { error } = await supabase.from('articles').insert([articleData]);

        if (error) throw error;
        toast.success('Статья создана');
      }

      setDialogOpen(false);
      resetForm();
      loadArticles();
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error('Ошибка при сохранении статьи');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;
      toast.success('Статья удалена');
      loadArticles();
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast.error('Ошибка при удалении статьи');
    }
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      cover_image: article.cover_image || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
    });
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
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <Link to="/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Управление статьями
                </h1>
                <p className="text-lg text-muted-foreground">
                  Создание и публикация контента
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить статью
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? 'Редактировать статью' : 'Добавить статью'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Заголовок</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Краткое описание</Label>
                      <Input
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Содержание</Label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                      />
                    </div>

                    <FileManager onImageSelect={(url) => setFormData({ ...formData, cover_image: url })} />

                    {formData.cover_image && (
                      <div className="space-y-2">
                        <Label>Обложка</Label>
                        <img src={formData.cover_image} alt="Cover" className="w-full max-h-48 object-contain rounded-lg border" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                        Отмена
                      </Button>
                      <Button type="submit" className="flex-1">
                        {editingArticle ? 'Сохранить' : 'Опубликовать'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle>Статьи</CardTitle>
                <CardDescription>Список всех статей в системе</CardDescription>
              </CardHeader>
              <CardContent>
                {articles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Статьи не найдены</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Обложка</TableHead>
                        <TableHead>Заголовок</TableHead>
                        <TableHead>Дата публикации</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            {article.cover_image ? (
                              <img src={article.cover_image} alt={article.title} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>
                            {article.published_at ? new Date(article.published_at).toLocaleDateString('ru-RU') : 'Не опубликовано'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link to={`/article/${article.slug}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(article)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminArticles;
