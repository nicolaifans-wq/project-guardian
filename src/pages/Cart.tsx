import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, totalAmount, updateQuantity, removeFromCart, checkout, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const orderId = await checkout();
    if (orderId) {
      navigate("/");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
            <p className="text-muted-foreground mb-6">
              Добавьте товары из каталога
            </p>
            <Button onClick={() => navigate("/catalog")}>
              Перейти в каталог
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
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <h1 className="text-4xl font-bold text-foreground mb-4">Корзина</h1>
            <p className="text-lg text-muted-foreground">
              {items.length} {items.length === 1 ? "товар" : "товаров"} в корзине
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{item.product.name}</h3>
                          <p className="text-lg font-bold text-primary">
                            {item.price.toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Итого</h2>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Товары ({items.length})</span>
                        <span className="font-semibold">
                          {totalAmount.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>К оплате</span>
                        <span className="text-primary">
                          {totalAmount.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      Оформить заказ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
