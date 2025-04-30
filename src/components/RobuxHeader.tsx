
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LifeBuoy, Menu, CubeIcon } from 'lucide-react';
import UserMenu from './UserMenu';

const RobuxHeader: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { path: '/robux', label: 'Главная', icon: <CubeIcon className="h-4 w-4 mr-2" /> },
    { path: '/support', label: 'Поддержка', icon: <LifeBuoy className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="w-full bg-background border-b sticky top-0 z-50">
      <div className="container-1920 mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/robux" className="mr-6 flex items-center space-x-2">
              <CubeIcon className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl">Robux Store</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              {navigationLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button 
                    variant={isActive(link.path) ? "secondary" : "ghost"} 
                    className="flex items-center"
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <UserMenu />
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-3 mt-6">
                  {navigationLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button 
                        variant={isActive(link.path) ? "secondary" : "ghost"} 
                        className="w-full justify-start"
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RobuxHeader;
