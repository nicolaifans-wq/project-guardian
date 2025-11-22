import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const checkoutSchema = z.object({
  name: z.string().trim().min(1, { message: "Имя обязательно" }).max(100),
  patronymic: z.string().trim().min(1, { message: "Отчество обязательно" }).max(100),
  email: z.string().trim().email({ message: "Неверный формат email" }).optional().or(z.literal('')),
  phone: z.string().trim().min(10, { message: "Номер телефона обязателен" }).max(20),
  comment: z.string().trim().max(500).optional(),
});

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { items, clearCart } = useCart();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    patronymic: '',
    email: '',
    phone: '',
    comment: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      checkoutSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setLoading(true);
    try {
      // Get or create order
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('Необходимо войти в систему');
        return;
      }

      // Find pending order
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('status', 'pending')
        .limit(1);

      const orderId = orders?.[0]?.id;

      if (!orderId) {
        toast.error('Корзина пуста');
        return;
      }

      // Calculate total amount from items
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'processing',
          total_amount: totalAmount,
          customer_name: formData.name,
          customer_patronymic: formData.patronymic,
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          customer_comment: formData.comment || null,
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
      clearCart();
      onOpenChange(false);
      setFormData({
        name: '',
        patronymic: '',
        email: '',
        phone: '',
        comment: '',
      });
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите ваше имя"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patronymic">Отчество *</Label>
            <Input
              id="patronymic"
              value={formData.patronymic}
              onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
              placeholder="Введите ваше отчество"
              className={errors.patronymic ? 'border-destructive' : ''}
            />
            {errors.patronymic && (
              <p className="text-sm text-destructive">{errors.patronymic}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (необязательно)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (когда вам удобно принять звонок)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Например: звоните после 18:00"
              rows={3}
              className={errors.comment ? 'border-destructive' : ''}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Оформление...
                </>
              ) : (
                'Оформить заказ'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
