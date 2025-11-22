import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (productId: string, price: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<string | null>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
      setCurrentOrderId(null);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      if (orderError) throw orderError;

      if (orders && orders.length > 0) {
        setCurrentOrderId(orders[0].id);

        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            product:products (
              name,
              image_url
            )
          `)
          .eq("order_id", orders[0].id);

        if (itemsError) throw itemsError;
        setItems(orderItems as any || []);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const addToCart = async (productId: string, price: number) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы добавить товар в корзину",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let orderId = currentOrderId;

      if (!orderId) {
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            status: "pending",
            total_amount: 0,
          })
          .select()
          .single();

        if (orderError) throw orderError;
        orderId = newOrder.id;
        setCurrentOrderId(orderId);
      }

      const existingItem = items.find((item) => item.product_id === productId);

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: orderId,
            product_id: productId,
            quantity: 1,
            price: price,
          });

        if (itemError) throw itemError;
      }

      await loadCart();
      toast({
        title: "Товар добавлен",
        description: "Товар успешно добавлен в корзину",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("order_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      await loadCart();
      toast({
        title: "Товар удален",
        description: "Товар удален из корзины",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар из корзины",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("order_items")
        .update({ quantity })
        .eq("id", itemId);

      if (error) throw error;
      await loadCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    // Just clear local state without deleting items from database
    setItems([]);
    setCurrentOrderId(null);
  };

  const checkout = async (): Promise<string | null> => {
    if (!currentOrderId || items.length === 0) return null;

    setIsLoading(true);
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { error } = await supabase
        .from("orders")
        .update({
          status: "processing",
          total_amount: total,
        })
        .eq("id", currentOrderId);

      if (error) throw error;

      const orderId = currentOrderId;
      setCurrentOrderId(null);
      setItems([]);

      toast({
        title: "Заказ оформлен",
        description: "Спасибо за ваш заказ!",
      });

      return orderId;
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
