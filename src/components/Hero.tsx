import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxOTZGMyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40" />

      <div className="container relative py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                Зима 2025 — Сезон выгодных предложений
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              Тепло и комфорт
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                для вашего дома
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              Современные решения для отопления, водоснабжения и климат-контроля. 
              Качество, надежность и профессиональный сервис.
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
              >
                Связаться с нами
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card rounded-3xl p-8 shadow-card">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Котлы и отопление</h3>
                    <p className="text-sm text-muted-foreground">Широкий выбор оборудования</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Водоснабжение</h3>
                    <p className="text-sm text-muted-foreground">Насосы и фильтры</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-2xl">❄️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Кондиционеры</h3>
                    <p className="text-sm text-muted-foreground">Климат-контроль круглый год</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
