import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <h1 className="text-4xl font-bold text-foreground mb-4">Контакты</h1>
            <p className="text-lg text-muted-foreground">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                        <p className="text-sm text-muted-foreground">Звоните в любое время</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@teplokomfort.ru</p>
                        <p className="text-sm text-muted-foreground">Ответим в течение 24 часов</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
                        <p className="text-sm text-muted-foreground">Приезжайте в наш офис</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Режим работы</h3>
                        <p className="text-muted-foreground">Пн-Пт: 9:00 - 19:00</p>
                        <p className="text-muted-foreground">Сб: 10:00 - 16:00</p>
                        <p className="text-muted-foreground">Вс: выходной</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Как нас найти</h2>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Карта будет здесь</p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Как добраться</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Метро «Примерная» - 5 минут пешком</li>
                      <li>• Парковка для клиентов - бесплатно</li>
                      <li>• Автобусы 123, 456 - остановка «Примерная»</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
