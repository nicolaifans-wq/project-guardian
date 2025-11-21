import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, product.price);
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer animate-fade-in"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden bg-winter-frost">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-64 w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Нет изображения</span>
          </div>
        )}
        {product.is_new && (
          <Badge className="absolute top-3 right-3 bg-accent hover:bg-accent/90 animate-scale-in">
            Новинка
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          {product.stock_quantity !== null && product.stock_quantity > 0 ? (
            <Badge variant="secondary">В наличии</Badge>
          ) : (
            <Badge variant="destructive">Нет в наличии</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isLoading || (product.stock_quantity !== null && product.stock_quantity <= 0)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  );
};
