import React from "react";
import { Star } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Star className="h-8 w-8 text-amber-400 fill-amber-400 animate-float" />
            <Star className="h-5 w-5 absolute -right-2 -top-1 text-amber-400 fill-amber-400 animate-pulse-light" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Звёздный Магазин
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Главная
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            О нас
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Поддержка
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
