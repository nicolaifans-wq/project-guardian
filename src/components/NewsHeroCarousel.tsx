import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

export const NewsHeroCarousel = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setArticles(data as Article[] || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-gradient-to-b from-winter-ice/30 to-background">
        <div className="container flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-winter-ice/30 to-background">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Новости и статьи
          </h2>
          <p className="text-muted-foreground">
            Будьте в курсе последних новостей и тенденций
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {articles.map((article) => (
              <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-1">
                  <div
                    className="group relative h-96 rounded-xl overflow-hidden cursor-pointer shadow-card hover:shadow-hover transition-all duration-300"
                    onClick={() => navigate(`/article/${article.slug}`)}
                  >
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {article.published_at && (
                        <div className="flex items-center gap-2 text-sm mb-2 opacity-80">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.published_at).toLocaleDateString("ru-RU")}
                        </div>
                      )}

                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm opacity-90 line-clamp-2 mb-4">
                          {article.excerpt}
                        </p>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        className="group-hover:bg-white group-hover:text-primary transition-colors"
                      >
                        Читать далее
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
