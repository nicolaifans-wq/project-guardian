import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminPages = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadPages();
    }
  }, [user, isAdmin]);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      console.error('Error loading pages:', error);
      toast.error('Ошибка при загрузке страниц');
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (pageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_active: !currentStatus })
        .eq('id', pageId);

      if (error) throw error;
      toast.success(currentStatus ? 'Страница скрыта' : 'Страница опубликована');
      loadPages();
    } catch (error: any) {
      console.error('Error toggling page status:', error);
      toast.error('Ошибка при изменении статуса');
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
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <Link to="/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Конструктор страниц
                </h1>
                <p className="text-lg text-muted-foreground">
                  Управление страницами сайта, секциями и дизайном
                </p>
              </div>
              <Button onClick={() => navigate('/admin/pages/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Создать страницу
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{page.title}</CardTitle>
                        <code className="text-xs text-muted-foreground">/{page.slug}</code>
                      </div>
                      <Badge variant={page.is_active ? "default" : "secondary"}>
                        {page.is_active ? 'Активна' : 'Скрыта'}
                      </Badge>
                    </div>
                    {page.meta_description && (
                      <CardDescription className="line-clamp-2">
                        {page.meta_description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/pages/${page.id}`)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePageStatus(page.id, page.is_active)}
                      >
                        {page.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pages.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">Пока нет страниц</p>
                  <Button onClick={() => navigate('/admin/pages/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Создать первую страницу
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPages;
