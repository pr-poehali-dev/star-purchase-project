import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import StarCounter from "@/components/StarCounter";
import PaymentMethods from "@/components/PaymentMethods";
import PriceCalculator from "@/components/PriceCalculator";
import Header from "@/components/Header";
import { Star } from "lucide-react";

const PRICE_PER_STAR = 1.72;

const Index: React.FC = () => {
  const [starCount, setStarCount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<string>("sbp");

  const handleStarCountChange = (value: number) => {
    setStarCount(value);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmitOrder = () => {
    alert(`Заказ оформлен! Количество звёзд: ${starCount}, Способ оплаты: ${paymentMethod}, Сумма: ${(starCount * PRICE_PER_STAR).toFixed(2)} ₽`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Купите звёзды по выгодной цене</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              От 50 до 500 звёзд по курсу 1 звезда = 1,72 рубля. Мгновенная доставка после оплаты.
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-8">
              <div className="bg-card rounded-lg shadow-sm p-6 border">
                <StarCounter 
                  value={starCount} 
                  onChange={handleStarCountChange} 
                  min={50} 
                  max={500} 
                  step={10}
                />
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6 border">
                <PaymentMethods 
                  selectedMethod={paymentMethod} 
                  onSelectMethod={handlePaymentMethodChange}
                />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 rounded-lg p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <Star className="h-16 w-16 text-amber-400 fill-amber-400" />
                    <div className="absolute -top-2 -right-2 flex">
                      <Star className="h-8 w-8 text-amber-400 fill-amber-400 animate-pulse-light" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Что вы получаете:</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600" />
                        </svg>
                      </div>
                      <span>Мгновенное зачисление</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600" />
                        </svg>
                      </div>
                      <span>Официальная гарантия</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600" />
                        </svg>
                      </div>
                      <span>Круглосуточная поддержка</span>
                    </li>
                  </ul>
                </div>
                
                <PriceCalculator 
                  starCount={starCount} 
                  pricePerStar={PRICE_PER_STAR} 
                />
                
                <Button 
                  className="w-full mt-6 py-6 text-lg" 
                  onClick={handleSubmitOrder}
                >
                  Оплатить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Звёздный Магазин. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
