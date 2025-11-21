import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const Catalog = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Каталог товаров
            </h1>
            <p className="text-lg text-muted-foreground">
              Полный ассортимент отопительного оборудования
            </p>
          </div>
        </section>
        <ProductGrid 
          title="Все товары" 
          description="Найдите идеальное решение для вашего дома"
        />
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
