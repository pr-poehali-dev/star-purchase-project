
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsOverview from "@/components/admin/StatsOverview";
import OrdersCard from "@/components/admin/OrdersCard";
import PaymentInfo from "@/components/admin/PaymentInfo";
import { useAdminSecret } from "@/contexts/AdminSecretContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Settings, AlertTriangle, Lock } from "lucide-react";

interface Order {
  id: number;
  telegramUsername: string;
  starCount: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  date: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

const Admin: React.FC = () => {
  const { secretKey: urlSecretKey } = useParams<{ secretKey?: string }>();
  const { isValidSecretKey, secretKey, siteSettings, updateSettings } = useAdminSecret();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tempSettings, setTempSettings] = useState(siteSettings);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем секретный ключ из URL
    if (urlSecretKey && isValidSecretKey(urlSecretKey)) {
      setIsAuthorized(true);
      loadOrders();
    } else if (urlSecretKey) {
      toast({
        title: "Доступ запрещен",
        description: "Неверный ключ доступа",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [urlSecretKey, isValidSecretKey]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('telegramStarOrders') || '[]') as Order[];
    setOrders(savedOrders);
    calculateStats(savedOrders);
  };

  const calculateStats = (orderData: Order[]) => {
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalPrice, 0);
    const pendingOrders = orderData.filter(order => 
      order.status === 'Новый' || order.status === 'В обработке'
    ).length;
    const completedOrders = orderData.filter(order => 
      order.status === 'Выполнен'
    ).length;
    
    setStats({
      totalOrders: orderData.length,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  };

  const updateOrderStatus = (id: number, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('telegramStarOrders', JSON.stringify(updatedOrders));
    calculateStats(updatedOrders);
  };

  const clearAllOrders = () => {
    if (window.confirm('Вы уверены, что хотите удалить все заказы? Это действие нельзя отменить.')) {
      localStorage.setItem('telegramStarOrders', '[]');
      setOrders([]);
      calculateStats([]);
      toast({
        title: "Заказы удалены",
        description: "Все заказы были успешно удалены",
      });
    }
  };

  const saveSettings = () => {
    updateSettings(tempSettings);
    toast({
      title: "Настройки сохранены",
      description: "Изменения вступят в силу немедленно",
    });
  };

  if (!isAuthorized && !urlSecretKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Доступ к панели администратора
            </CardTitle>
            <CardDescription>
              Для доступа используйте специальную ссылку с секретным ключом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  Эта страница доступна только по секретной ссылке. Если вы администратор, используйте правильный ключ доступа.
                </div>
              </div>
              <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                Адрес: {window.location.origin}/admin/СПЕЦИАЛЬНЫЙ_КЛЮЧ
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminHeader />
      
      <main className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="payment">Платежные реквизиты</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <StatsOverview {...stats} />
            
            <OrdersCard 
              orders={orders}
              filter={filter}
              setFilter={setFilter}
              updateOrderStatus={updateOrderStatus}
              clearAllOrders={clearAllOrders}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> 
                  Настройки сайта
                </CardTitle>
                <CardDescription>
                  Настройте параметры работы сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="starPrice">
                      Цена за 1 звезду (₽)
                    </label>
                    <Input 
                      id="starPrice"
                      type="number" 
                      step="0.01"
                      value={tempSettings.starPrice} 
                      onChange={(e) => setTempSettings({...tempSettings, starPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="companyName">
                      Название компании (ИП)
                    </label>
                    <Input 
                      id="companyName"
                      value={tempSettings.companyName} 
                      onChange={(e) => setTempSettings({...tempSettings, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="minStars">
                      Минимальное количество звезд
                    </label>
                    <Input 
                      id="minStars"
                      type="number" 
                      value={tempSettings.minStars} 
                      onChange={(e) => setTempSettings({...tempSettings, minStars: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="maxStars">
                      Максимальное количество звезд
                    </label>
                    <Input 
                      id="maxStars"
                      type="number" 
                      value={tempSettings.maxStars} 
                      onChange={(e) => setTempSettings({...tempSettings, maxStars: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="phoneNumber">
                      Номер телефона для платежей
                    </label>
                    <Input 
                      id="phoneNumber"
                      value={tempSettings.phoneNumber} 
                      onChange={(e) => setTempSettings({...tempSettings, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={saveSettings}>Сохранить настройки</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentInfo />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
