;

import { useState, useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_DAYS = 365; // Maximum number of days (approximately 1 year)

interface JobDurationSliderProps {
  onRangeChange?: (range: number[]) => void;
}

export default function JobDurationSlider({
  onRangeChange,
}: JobDurationSliderProps) {
  const [range, setRange] = useState([30, 180]); // Default range: 1 month to 6 months

  const handleSliderChange = useCallback(
    (newValues: number[]) => {
      setRange(newValues);
      if (onRangeChange) {
        onRangeChange(newValues); // Notify the parent component
      }
    },
    [onRangeChange]
  );

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= MAX_DAYS) {
        const newRange = [...range];
        newRange[index] = numValue;
        if (index === 0 && numValue <= range[1]) {
          setRange(newRange);
          if (onRangeChange) {
            onRangeChange(newRange); // Notify the parent component
          }
        } else if (index === 1 && numValue >= range[0]) {
          setRange(newRange);
          if (onRangeChange) {
            onRangeChange(newRange); // Notify the parent component
          }
        }
      }
    },
    [range, onRangeChange]
  );

  const formatDuration = (days: number) => {
    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Label htmlFor="minDuration">Min days</Label>
          <Input
            id="minDuration"
            type="number"
            min={1}
            max={MAX_DAYS}
            value={range[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="w-24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxDuration" className="flex gap-2 items-center">
            Max days
            <TooltipProvider delayDuration={100} skipDelayDuration={500}>
              <Tooltip >
                <TooltipTrigger >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                  </svg>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Can extend upto</p>
                  
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="maxDuration"
            type="number"
            min={1}
            max={MAX_DAYS}
            value={range[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="w-24"
          />
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={range}
        onValueChange={handleSliderChange}
        min={1}
        max={MAX_DAYS}
        step={1}
      >
        <Slider.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-slate-900 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-slate-900 shadow-md rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label="Min duration"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-slate-900 shadow-md rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label="Max duration"
        />
      </Slider.Root>
      <div className="text-sm text-gray-600">
        Range: {formatDuration(range[0])} - {formatDuration(range[1])}
      </div>
    </div>
  );
}
