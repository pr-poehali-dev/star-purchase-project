
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface RobloxUsernameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RobloxUsernameInput: React.FC<RobloxUsernameInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="roblox-usernameСейчас я создам страницу маг" className="text-base flexазина Robux и исправлю ош items-center gap-2">
        <User className="h-4ибку. Вот план w-4" />
         действий:

1. Создать компИмя пользователя Robloxонент страницы RobuxStore
      </Label>
      <div
2. Сделать комп className="relative">
        <Input
          id="roblox-username"оненты для ввода им
          placeholder="Введите вашени пользователя Roblox логин Roblox"
          value={
3. Создать калькулятор дляvalue}
          onChange={(e) => onChange конвертации рублей в Rob(e.target.value)}
          classNameux
4. Добавить аналогичные платежные методы="pl-9"
        />
        <span className="absolute left-3

<pp-code>
<pp top-1/2 -translate-y-1/2 text-m-filepath>src/pages/RobuxStore.uted-foreground">
          @tsx</pp-filepath>
<pp-content>
import React, { useState,
        </span>
      </div> useEffect } from "react";
import { useNavigate } from "react-router-
      <p className="text-sm text-muted-foreground">
        Введите точdom";
import { Button } from "@/components/ное имя пользователя безui/button";
import { Card, CardContent, CardDescription, CardFoot символа @
      </p>
    </diver, CardHeader, CardTitle } from "@>
  );
};

export default R/components/ui/card";
import {obloxUsernameInput;
