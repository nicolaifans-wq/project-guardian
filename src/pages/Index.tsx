import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsHeroCarousel } from "@/components/NewsHeroCarousel";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <NewsHeroCarousel />
        <FeaturedProducts />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
