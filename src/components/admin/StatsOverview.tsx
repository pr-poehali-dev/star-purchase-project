import React from "react";
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

interface StatsProps {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

const StatsOverview: React.FC<StatsProps> = ({ 
  totalOrders, 
  totalRevenue, 
  pendingOrders, 
  completedOrders 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Всего заказов" 
        value={totalOrders} 
        icon={Users} 
      />
      
      <StatCard 
        title="Выручка" 
        value={`${totalRevenue.toFixed(2)} ₽`} 
        icon={DollarSign} 
      />
      
      <StatCard 
        title="Ожидают обработки" 
        value={pendingOrders} 
        icon={Clock} 
        iconColor="text-yellow-500" 
      />
      
      <StatCard 
        title="Выполнено" 
        value={completedOrders} 
        icon={CheckCircle} 
        iconColor="text-green-500" 
      />
    </div>
  );
};

export default StatsOverview;
