import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string | null;
  customer_patronymic: string | null;
  customer_email: string | null;
  customer_phone: string;
  customer_comment: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product_id: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<(OrderItem & { product: Product })[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadOrders();
    }
  }, [user, isAdmin]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'processing')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (id, name, image_url)
        `)
        .eq('order_id', orderId);

      if (error) throw error;

      const formattedItems = (data || []).map(item => ({
        ...item,
        product: item.products as unknown as Product,
      }));

      setOrderItems(formattedItems);
    } catch (error: any) {
      console.error('Error loading order details:', error);
      toast.error('Ошибка при загрузке деталей заказа');
    }
  };

  const openDetailsDialog = async (order: Order) => {
    setSelectedOrder(order);
    await loadOrderDetails(order.id);
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
            <Link to="/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Заявки от клиентов
            </h1>
            <p className="text-lg text-muted-foreground">
              Список всех оформленных заказов
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle>Заявки</CardTitle>
                <CardDescription>Новые заказы от клиентов</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Новых заявок нет</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Клиент</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            {new Date(order.created_at).toLocaleString('ru-RU')}
                          </TableCell>
                          <TableCell>
                            {order.customer_name} {order.customer_patronymic}
                          </TableCell>
                          <TableCell>{order.customer_phone}</TableCell>
                          <TableCell className="font-medium">{order.total_amount} ₽</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsDialog(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Имя и отчество</p>
                  <p className="text-lg">
                    {selectedOrder.customer_name} {selectedOrder.customer_patronymic}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Телефон</p>
                  <p className="text-lg">{selectedOrder.customer_phone}</p>
                </div>
                {selectedOrder.customer_email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{selectedOrder.customer_email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Дата заказа</p>
                  <p className="text-lg">
                    {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

              {selectedOrder.customer_comment && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Комментарий</p>
                  <p className="text-base bg-muted p-3 rounded-lg">
                    {selectedOrder.customer_comment}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Товары в заказе</p>
                <div className="space-y-2">
                  {orderItems.map((item) => (
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

export default AdminOrders;
