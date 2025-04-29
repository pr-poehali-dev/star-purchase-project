import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TelegramUsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TelegramUsernameInput: React.FC<TelegramUsernameInputProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="telegram-username" className="text-base font-medium">
        Ваш username в Telegram
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          @
        </div>
        <Input
          id="telegram-username"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="username"
          className="pl-8"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Звёзды будут зачислены на указанный аккаунт Telegram
      </p>
    </div>
  );
};

export default TelegramUsernameInput;
