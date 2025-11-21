import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Clock, ThumbsUp } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-winter-sky/20 via-background to-winter-ice/30">
          <div className="container">
            <h1 className="text-4xl font-bold text-foreground mb-4">О нас</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              ТеплоКомфорт — ваш надежный партнер в мире отопительного оборудования с 2010 года
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">15+ лет опыта</h3>
                  <p className="text-sm text-muted-foreground">
                    Работаем на рынке с 2010 года
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">10 000+ клиентов</h3>
                  <p className="text-sm text-muted-foreground">
                    Довольных заказчиков по всей России
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">24/7 поддержка</h3>
                  <p className="text-sm text-muted-foreground">
                    Всегда на связи для вас
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <ThumbsUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Гарантия качества</h3>
                  <p className="text-sm text-muted-foreground">
                    Официальная гарантия на все товары
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
                <p className="text-muted-foreground">
                  Мы стремимся обеспечить каждый дом качественным и надежным отопительным оборудованием. 
                  Наша цель — создать комфортные условия для жизни наших клиентов, предлагая современные 
                  решения по доступным ценам.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Почему выбирают нас</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Широкий ассортимент товаров от ведущих производителей</li>
                  <li>✓ Профессиональная консультация и помощь в выборе</li>
                  <li>✓ Доставка по всей России</li>
                  <li>✓ Гибкая система скидок и акций</li>
                  <li>✓ Гарантийное и послегарантийное обслуживание</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
