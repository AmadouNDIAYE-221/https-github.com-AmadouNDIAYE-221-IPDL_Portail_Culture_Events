"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  id?: string
  selected?: Date | null
  onSelect?: (date: Date | null) => void
  disabled?: boolean
  placeholderText?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  id,
  selected,
  onSelect,
  disabled = false,
  placeholderText = "Sélectionner une date",
  minDate,
  maxDate
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, "PPP", { locale: fr })
          ) : (
            <span>{placeholderText}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={onSelect}
          initialFocus
          locale={fr}
          disabled={(date) => {
            const isBeforeMinDate = minDate ? date < minDate : false
            const isAfterMaxDate = maxDate ? date > maxDate : false
            return isBeforeMinDate || isAfterMaxDate
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
