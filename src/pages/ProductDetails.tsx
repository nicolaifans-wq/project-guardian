import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_featured: boolean | null;
  is_new: boolean | null;
  stock_quantity: number | null;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data as Product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
            <Button onClick={() => navigate("/catalog")}>
              Вернуться в каталог
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
        <section className="py-8">
          <div className="container">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full rounded-lg shadow-card"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Нет изображения</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-2">
                    {product.is_new && <Badge>Новинка</Badge>}
                    {product.stock_quantity !== null && product.stock_quantity > 0 ? (
                      <Badge variant="secondary">В наличии</Badge>
                    ) : (
                      <Badge variant="destructive">Нет в наличии</Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                  <p className="text-3xl font-bold text-primary mb-6">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </p>
                </div>

                {product.description && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Описание</h2>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => addToCart(product.id, product.price)}
                    disabled={cartLoading || (product.stock_quantity !== null && product.stock_quantity <= 0)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
