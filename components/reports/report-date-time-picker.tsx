'use client'

import { CalendarDays, ChevronDown, Clock3 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  formatReportDateTimeValue,
  parseReportDateTimeValue,
  serializeReportDateTimeParts,
  type ReportDateTimeParts,
} from '@/lib/reports/report-date-time'

const HOURS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
)
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0'),
)

function initialParts(value: string): ReportDateTimeParts {
  const parsed = parseReportDateTimeValue(value)
  if (parsed) return parsed

  const now = new Date()
  return {
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12),
    hour: String(now.getHours() % 12 || 12).padStart(2, '0'),
    minute: String(now.getMinutes()).padStart(2, '0'),
    period: now.getHours() >= 12 ? 'PM' : 'AM',
  }
}

export function ReportDateTimePicker({
  id,
  value,
  onChange,
  disabled,
  describedBy,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  describedBy?: string
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ReportDateTimeParts>(() =>
    initialParts(value),
  )

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setDraft(initialParts(value))
    setOpen(nextOpen)
  }

  function updateDraft(
    field: 'hour' | 'minute' | 'period',
    nextValue: string,
  ) {
    setDraft(current => ({
      ...current,
      [field]: nextValue,
    }))
  }

  function applySelection() {
    onChange(serializeReportDateTimeParts(draft))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-describedby={describedBy}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'h-12 w-full justify-start rounded-xl border-slate-300 bg-white px-4',
            'text-left text-base font-normal text-slate-900 shadow-sm',
            'hover:bg-slate-50 focus-visible:ring-blue-600',
            !value && 'text-slate-500',
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className="mr-3 h-4 w-4 shrink-0 text-blue-700"
          />
          <span className="min-w-0 flex-1 truncate">
            {formatReportDateTimeValue(value)}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="ml-2 h-4 w-4 shrink-0 text-slate-400"
          />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[22rem]',
          'gap-0 overflow-y-auto rounded-2xl border-slate-200 p-0 shadow-2xl',
          'sm:max-w-[42rem]',
        )}
      >
        <div className="border-b border-slate-100 px-5 py-4 pr-12">
          <DialogTitle className="flex items-center gap-2 text-base text-slate-950">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-blue-700" />
            Choose date and time
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-xs leading-5 text-slate-500">
            Select the calendar date and exact time in India Standard Time.
          </DialogDescription>
        </div>

        <div className="sm:grid sm:grid-cols-[21rem_1fr]">
          <Calendar
            mode="single"
            selected={draft.date}
            defaultMonth={draft.date}
            onSelect={date => {
              if (date) {
                setDraft(current => ({
                  ...current,
                  date: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    12,
                  ),
                }))
              }
            }}
            className="mx-auto [--cell-size:2.25rem] sm:border-r sm:border-slate-100"
          />

          <div className="flex flex-col border-t border-slate-100 bg-slate-50/80 sm:border-l-0 sm:border-t-0">
            <fieldset className="flex-1 px-4 py-5">
              <legend className="sr-only">
                Choose time in India Standard Time
              </legend>
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock3 aria-hidden="true" className="h-4 w-4 text-blue-700" />
                Time <span className="font-normal text-slate-500">(IST)</span>
              </p>

              <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Hour</span>
                  <select
                    id={`${id}-hour`}
                    value={draft.hour}
                    onChange={event => updateDraft('hour', event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    {HOURS.map(hour => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">
                    Minute
                  </span>
                  <select
                    id={`${id}-minute`}
                    value={draft.minute}
                    onChange={event => updateDraft('minute', event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    {MINUTES.map(minute => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">
                    Period
                  </span>
                  <select
                    id={`${id}-period`}
                    value={draft.period}
                    onChange={event => updateDraft('period', event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-slate-950 px-5 hover:bg-blue-700"
                onClick={applySelection}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
