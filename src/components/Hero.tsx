import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-snowboarding.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-sm animate-pulse">
                🔥 Зима 2025 — Согреем ваш дом в -50°C
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Тепло и комфорт
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                для вашего дома
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
              Современное отопительное оборудование в Томмоте, Якутия. 
              Котлы, счетчики воды, радиаторы и термостаты для экстремальных морозов.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/catalog")}
                className="bg-primary hover:bg-primary/90 hover-scale"
              >
                Каталог оборудования
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="hover-scale"
              >
                Связаться с нами
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Работаем при -50°C</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Томмот, Якутия</span>
              </div>
            </div>
          </div>

          {/* Image with Fire Effect */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <img 
                src={heroImage} 
                alt="Уютный дом с современным отоплением в зимней Якутии" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-medium backdrop-blur-sm bg-black/30 inline-block px-3 py-1 rounded-full">
                  Северное сияние над Якутией
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
