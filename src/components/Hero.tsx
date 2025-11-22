import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-snowboarding.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Snowboarding at sunset" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      <div className="container relative py-24 lg:py-32">
        <div className="max-w-2xl space-y-8 animate-slide-up">
          <div className="inline-block">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-sm">
              Зима 2025 — Сезон выгодных предложений
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
            Покори вершины
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              этой зимой
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl">
            Профессиональное оборудование для сноубординга и зимних видов спорта. 
            Качество, надежность и стиль в каждой детали.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/catalog")}
              className="bg-primary hover:bg-primary/90"
            >
              Каталог товаров
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
              className="backdrop-blur-sm bg-background/50"
            >
              Связаться с нами
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
