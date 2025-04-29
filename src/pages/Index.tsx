
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TelegramUsernameInput from "@/components/TelegramUsernameInput";
import StarCounter from "@/components/StarCounter";
import PriceCalculator from "@/components/PriceCalculator";
import PaymentMethods from "@/components/PaymentMethods";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useAdminSecret } from "@/contexts/AdminSecretContext";

const Index: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState("");
  const [starCount, setStarCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("sbp");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { siteSettings } = useAdminSecret();

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
    
    // Установим минимальное количество звезд из настроек
    setStarCount(siteSettings.minStars);
  }, [siteSettings.minStars]);

  const handleCreateOrder = () => {
    // Проверяем авторизацию
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для совершения покупки необходимо войти в аккаунт",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!telegramUsername) {
      toast({
        title: "Ошибка",
        description: "Введите имя пользователя Telegram",
        variant: "destructive",
      });
      return;
    }

    if (starCount < siteSettings.minStars || starCount > siteSettings.maxStars) {
      toast({
        title: "Ошибка",
        description: `Выберите количество звезд от ${siteSettings.minStars} до ${siteSettings.maxStars}`,
        variant: "destructive",
      });
      return;
    }

    setIsCreatingOrder(true);

    // Имитация создания заказа
    setTimeout(() => {
      const totalPrice = Number((starCount * siteSettings.starPrice).toFixed(2));
      const newOrder = {
        id: Date.now(),
        telegramUsername,
        starCount,
        paymentMethod,
        totalPrice,
        status: "Новый",
        date: new Date().toISOString(),
        userEmail: localStorage.getItem('userEmail') || 'unknown@email.com'
      };

      // Сохраняем заказ в локальное хранилище
      const orders = JSON.parse(localStorage.getItem('telegramStarOrders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('telegramStarOrders', JSON.stringify(orders));

      toast({
        title: "Заказ создан",
        description: `Заказ #${newOrder.id} успешно создан. Пожалуйста, выполните оплату.`,
      });

      setIsCreatingOrder(false);
      // Сбрасываем форму
      setTelegramUsername("");
      setStarCount(siteSettings.minStars);
      setPaymentMethod("sbp");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container-1920 mx-auto px-4 py-8 md:py-12">
        <div className="content-container max-w-2xl mx-auto">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Купить звезды Telegram</CardTitle>
              <CardDescription>
                Отправьте звезды любому пользователю Telegram
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Требуется авторизация</p>
                    <p className="text-sm">Для совершения покупки необходимо <a href="/login" className="underline font-medium">войти в аккаунт</a></p>
                  </div>
                </div>
              )}
              
              <TelegramUsernameInput 
                value={telegramUsername} 
                onChange={setTelegramUsername} 
              />
              
              <StarCounter 
                value={starCount} 
                onChange={setStarCount}
                minStars={siteSettings.minStars}
                maxStars={siteSettings.maxStars}
              />
              
              <PriceCalculator 
                starCount={starCount} 
                pricePerStar={siteSettings.starPrice}
              />
              
              <PaymentMethods 
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleCreateOrder}
                disabled={isCreatingOrder || !isAuthenticated}
                className="w-full"
                size="lg"
              >
                {isCreatingOrder ? "Создание заказа..." : "Оплатить"}
                {!isCreatingOrder && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Вопросы? <a href="#" className="underline hover:text-primary">Свяжитесь с нами</a></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
