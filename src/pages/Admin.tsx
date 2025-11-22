import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingBag, Newspaper, Users, FolderOpen, FileText, Palette } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isJournalist } = useAuth();

  useEffect(() => {
    if (!user || (!isAdmin && !isJournalist)) {
      navigate("/");
    }
  }, [user, isAdmin, isJournalist, navigate]);

  if (!user) {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Панель управления
            </h1>
            <p className="text-lg text-muted-foreground">
              Управление контентом и настройками сайта
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isAdmin && (
                <>
                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/products')}>
                    <CardHeader>
                      <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Товары</CardTitle>
                      <CardDescription>
                        Управление каталогом товаров
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Добавление, редактирование и удаление товаров
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/categories')}>
                    <CardHeader>
                      <FolderOpen className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Категории</CardTitle>
                      <CardDescription>
                        Управление категориями товаров
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Организация структуры каталога
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/users')}>
                    <CardHeader>
                      <Users className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Пользователи</CardTitle>
                      <CardDescription>
                        Управление пользователями и ролями
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Назначение ролей и прав доступа
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/orders')}>
                    <CardHeader>
                      <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Заявки</CardTitle>
                      <CardDescription>
                        Заказы от клиентов
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Просмотр и обработка заявок
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/stats')}>
                    <CardHeader>
                      <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Статистика</CardTitle>
                      <CardDescription>
                        Аналитика и отчеты
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Обзор ключевых показателей
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/pages')}>
                    <CardHeader>
                      <Palette className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>Конструктор страниц</CardTitle>
                      <CardDescription>
                        Визуальное редактирование
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Управление страницами, секциями и темой
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {(isAdmin || isJournalist) && (
                <Card className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate('/admin/articles')}>
                  <CardHeader>
                    <Newspaper className="h-12 w-12 mb-4 text-primary" />
                    <CardTitle>Статьи</CardTitle>
                    <CardDescription>
                      Управление новостями и статьями
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Создание и публикация контента
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Для полного управления контентом используйте раздел Cloud в верхнем меню.
                  Там вы можете напрямую управлять базой данных, добавлять и редактировать записи.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
