

import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SimpleDatetimeInput = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onValueChange: (date: Date) => void;
    disablePastDates?: boolean;
  }
>(({ className, onValueChange, disabled, disablePastDates = false }, ref) => {
  const [dateTime, setDateTime] = React.useState<Date>(new Date())

  const handleDateTimeChange = (newDateTime: Date) => {
    setDateTime(newDateTime)
    onValueChange(newDateTime)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateTime && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateTime ? format(dateTime, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DateTimeLocalInput 
          value={dateTime} 
          onValueChange={handleDateTimeChange} 
          disablePastDates={disablePastDates} 
        />
      </PopoverContent>
    </Popover>
  )
})

SimpleDatetimeInput.displayName = "SimpleDatetimeInput"

const TimePicker = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
  const handleTimeClick = (hours: number, minutes: number) => {
    const newDate = new Date(value)
    newDate.setHours(hours, minutes)
    onChange(newDate)
  }

  return (
    <div className="space-y-2 pr-3 py-3 relative">
      <h3 className="text-sm font-medium flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        Time
      </h3>
      <ScrollArea className="h-[220px] w-full py-0.5">
        <ul className="flex items-center flex-col gap-1 w-28 px-1 py-0.5">
          {Array.from({ length: 24 }).map((_, hour) =>
            [0, 15, 30, 45].map((minute, _index) => {
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
              const isSelected = value.getHours() === hour && value.getMinutes() === minute
              return (
                <li
                  key={`time-${hour}-${minute}`}
                  className={cn(
                    buttonVariants({ variant: isSelected ? "default" : "outline" }),
                    "h-8 px-3 w-full text-sm cursor-pointer"
                  )}
                  onClick={() => handleTimeClick(hour, minute)}
                >
                  {timeString}
                </li>
              )
            })
          )}
        </ul>
      </ScrollArea>
    </div>
  )
}

const DateTimeLocalInput = ({ 
  value, 
  onValueChange, 
  disablePastDates 
}: { 
  value: Date; 
  onValueChange: (date: Date) => void;
  disablePastDates: boolean;
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handlePresetChange = (days: number) => {
    const newDate = addDays(new Date(), days)
    onValueChange(newDate)
  }

  return (
    <div className="flex flex-col p-2 space-y-2">
      <Select onValueChange={(value: string) => handlePresetChange(parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Quick select" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="0">Today</SelectItem>
          <SelectItem value="1">Tomorrow</SelectItem>
          <SelectItem value="3">In 3 days</SelectItem>
          <SelectItem value="7">In a week</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(newDate) => newDate && onValueChange(newDate)}
          disabled={disablePastDates ? (date) => date < today : undefined}
          initialFocus
        />
        <TimePicker value={value} onChange={onValueChange} />
      </div>
    </div>
  )
}

export { SimpleDatetimeInput }