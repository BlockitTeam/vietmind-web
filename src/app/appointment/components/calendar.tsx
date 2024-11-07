import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className=""
    />
  )
}