import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Package, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      // Fetch user's processing orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'processing')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Fetch items for each order
      if (ordersData && ordersData.length > 0) {
        const itemsPromises = ordersData.map(async (order) => {
          const { data, error } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              products (id, name, image_url)
            `)
            .eq('order_id', order.id);

          if (error) throw error;

          return {
            orderId: order.id,
            items: data?.map(item => ({
              ...item,
              product: item.products as any,
            })) || [],
          };
        });

        const itemsResults = await Promise.all(itemsPromises);
        const itemsMap: Record<string, OrderItem[]> = {};
        itemsResults.forEach(({ orderId, items }) => {
          itemsMap[orderId] = items;
        });
        setOrderItems(itemsMap);
      }
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsDialog = (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItems(orderItems[order.id] || []);
    setDetailsDialogOpen(true);
  };

  if (loading) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Мои заказы
            </h1>
            <p className="text-lg text-muted-foreground">
              История ваших оформленных заказов
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-xl font-medium text-muted-foreground mb-2">
                    У вас пока нет заказов
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Оформите свой первый заказ в каталоге
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>
                            Заказ от {new Date(order.created_at).toLocaleDateString('ru-RU')}
                          </CardTitle>
                          <CardDescription>
                            Статус: В обработке
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Итого:</p>
                            <p className="text-2xl font-bold">{order.total_amount} ₽</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetailsDialog(order)}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Дата заказа</p>
                  <p className="text-lg">
                    {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Статус</p>
                  <p className="text-lg">В обработке</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Товары в заказе</p>
                <div className="space-y-2">
                  {selectedOrderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Количество: {item.quantity} × {item.price} ₽
                        </p>
                      </div>
                      <p className="font-medium">{item.quantity * item.price} ₽</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Итого:</p>
                    <p className="text-2xl font-bold">{selectedOrder.total_amount} ₽</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MyOrders;
