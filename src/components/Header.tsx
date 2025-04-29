import React from "react";
import { Link } from "react-router-dom";
import { Star, Send } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="border-b py-4 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Send className="h-3 w-3 text-blue-500 fill-blue-500 rotate-45" />
            </div>
          </div>
          <span className="font-bold text-lg">Звёзды Telegram</span>
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <a 
                href="https://t.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Telegram
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Поддержка
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
