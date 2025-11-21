import { ProductCard } from "./ProductCard";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  searchQuery?: string;
  title?: string;
  description?: string;
}

export const ProductGrid = ({
  searchQuery = "",
  title = "Популярные товары",
  description = "Проверенное качество и надежность"
}: ProductGridProps) => {
  const { products, isLoading, error } = useProductSearch(searchQuery);

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center text-destructive">
            Ошибка при загрузке товаров: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Товары не найдены
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
