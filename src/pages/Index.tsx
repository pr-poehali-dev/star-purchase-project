import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import StarCounter from "@/components/StarCounter";
import PaymentMethods from "@/components/PaymentMethods";
import PriceCalculator from "@/components/PriceCalculator";
import TelegramUsernameInput from "@/components/TelegramUsernameInput";
import Header from "@/components/Header";
import { Star, Send } from "lucide-react";
import { Link } from "react-router-dom";

const PRICE_PER_STAR = 1.72;

const Index: React.FC = () => {
  const [starCount, setStarCount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<string>("sbp");
  const [telegramUsername, setTelegramUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  const handleStarCountChange = (value: number) => {
    setStarCount(value);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleTelegramUsernameChange = (username: string) => {
    setTelegramUsername(username);
    if (username && !username.match(/^[a-zA-Z0-9_]{5,32}$/)) {
      setUsernameError("Некорректный username Telegram");
    } else {
      setUsernameError("");
    }
  };

  const handleSubmitOrder = () => {
    if (!telegramUsername) {
      setUsernameError("Пожалуйста, укажите ваш username в Telegram");
      return;
    }
    
    if (usernameError) {
      return;
    }

    // В реальном приложении здесь был бы API запрос
    alert(`Заказ оформлен! Количество звёзд: ${starCount}, Способ оплаты: ${paymentMethod}, Сумма: ${(starCount * PRICE_PER_STAR).toFixed(2)} ₽, Telegram: @${telegramUsername}`);
    
    // Отправка заказа на "бэкенд" (в данном случае просто сохраняем в localStorage)
    const orders = JSON.parse(localStorage.getItem('telegramStarOrders') || '[]');
    orders.push({
      id: Date.now(),
      telegramUsername,
      starCount,
      paymentMethod,
      totalPrice: Number((starCount * PRICE_PER_STAR).toFixed(2)),
      status: 'Новый',
      date: new Date().toISOString()
    });
    localStorage.setItem('telegramStarOrders', JSON.stringify(orders));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Купите звёзды Telegram по выгодной цене</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              От 50 до 500 звёзд Telegram по курсу 1 звезда = 1,72 рубля. Мгновенная доставка после оплаты на ваш аккаунт.
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
                <TelegramUsernameInput
                  value={telegramUsername}
                  onChange={handleTelegramUsernameChange}
                  error={usernameError}
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
                    <div className="relative">
                      <Star className="h-16 w-16 text-amber-400 fill-amber-400" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Send className="h-7 w-7 text-blue-500 fill-blue-500 rotate-45" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 flex">
                      <Star className="h-8 w-8 text-amber-400 fill-amber-400 animate-pulse" />
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
                      <span>Официальные звёзды Telegram</span>
                    </li>
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
          <p>© 2025 Звёзды Telegram. Все права защищены.</p>
          <div className="mt-2">
            <Link to="/admin" className="text-primary hover:text-primary/80 text-xs">Панель администратора</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
