
import React, { useStatesrc/components/RobloxUsernameInput.tsx } from 'react';
import { Link</pp-filepath>
<pp-content>
import React from "react";
import, useLocation } from 'react-router-dom'; { Input } from "@/components/ui/
import { Button } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, Carbutton";
import { Sheet, SheetContent,dContent } from "@/components/ui/car SheetTrigger } from "@/components/ui/sheet";
import { Lifd";
import { SearchIcon } from "lucide-react";

interface RobloxUserneBuoy, Menu, Gamepad2ameInputProps {
  value: string;
  onChange: (value: string) => } from 'lucide-react void;
}

const RobloxUsern';
import UserMenu from './UserMenu';ameInput: React.FC<Roblox

const Header: React.FC = () => {UsernameInputProps> = ({ value,
  const location = useLocation(); onChange }) => {
  return (
    
  const [isMobileMenuOpen, set<div className="space-y-3">
      IsMobileMenuOpen] = useState(false<Label htmlFor="roblox-username" className="text);

  const isActive = (path: string-base">
        Имя) => {
    return location.pathname === пользователя Roblox
       path;
  };

  const navigation</Label>
      
      <Card className="Links = [
    { path: '/', label:border-2">
        <CardContent className="pt-6">
          <div className 'Главная', icon: ="relative">
            <Search<Gamepad2 className="h-4 Icon className="absolute left-3 top-1/2 transform -translate-y-w-4 mr-2" /> },1/2 text-muted-fore
    { path: '/support', label: 'Поддержка', icon:ground h-5 w- <LifeBuoy className="h-5" />
            <Input
              id="robl4 w-4 mr-2"ox-username"
              placeholder="Введите им /> },
  ];

  return (я пользователя Roblox"
    <header className="w-full bg
              value={value}
              onChange={(e) => onChange(e.target.value-background border-b sticky top-0 z)}
              className="pl-10"
            />
          </div>
          -50">
      <div className="container-1920 mx-auto">
          <p className="text-sm text-muted-foreground mt-2">
            
        <div className="flex h-16 items-center justify-between px-4">Укажите имя пользователя R
          <div className="flex items-centeroblox, на который будут зач">
            <Link to="/" className="mrислены Robux.
          </p-6 flex items-center space>
        </CardContent>
      -x-2">
              </Card>
    </div>
  );<Gamepad2 className="h-6
};

export default RobloxUsern w-6 text-primaryameInput;
