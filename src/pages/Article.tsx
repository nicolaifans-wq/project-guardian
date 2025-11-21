import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
}

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .not("published_at", "is", null)
          .single();

        if (error) throw error;
        setArticle(data as Article);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
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

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Статья не найдена</h2>
            <Button onClick={() => navigate("/")}>
              Вернуться на главную
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-8">
          <div className="container max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>

            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg shadow-card mb-8"
              />
            )}

            <div className="mb-6">
              {article.published_at && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time>
                    {new Date(article.published_at).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            </div>

            {article.content && (
              <div className="prose prose-lg max-w-none">
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
