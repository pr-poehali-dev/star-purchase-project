import React from "react";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface StarCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const StarCounter: React.FC<StarCounterProps> = ({
  value,
  onChange,
  min = 50,
  max = 500,
  step = 10
}) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <span className="font-medium text-lg">Количество звёзд</span>
        </div>
        <div className="text-3xl font-bold text-primary">{value}</div>
      </div>
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        className="py-4"
      />
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default StarCounter;
