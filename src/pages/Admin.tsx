import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsOverview from "@/components/admin/StatsOverview";
import OrdersCard from "@/components/admin/OrdersCard";
import PaymentInfo from "@/components/admin/PaymentInfo";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    loadOrders();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <AdminHeader />
      
      <main className="container mx-auto px-4 pb-8">
        <StatsOverview {...stats} />
        
        <OrdersCard 
          orders={orders}
          filter={filter}
          setFilter={setFilter}
          updateOrderStatus={updateOrderStatus}
        />
        
        <PaymentInfo />
      </main>
    </div>
  );
};

export default Admin;
