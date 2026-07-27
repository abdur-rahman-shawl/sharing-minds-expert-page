export type ReportDateTimeParts = {
  date: Date
  hour: string
  minute: string
  period: 'AM' | 'PM'
}

const REPORT_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function parseReportDateTimeValue(
  value: string,
): ReportDateTimeParts | null {
  const match = REPORT_DATE_TIME_PATTERN.exec(value)
  if (!match) return null

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const hour24 = Number(hourValue)
  const minute = Number(minuteValue)
  const date = new Date(year, month - 1, day, 12)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    hour24 > 23 ||
    minute > 59
  ) {
    return null
  }

  return {
    date,
    hour: pad(hour24 % 12 || 12),
    minute: pad(minute),
    period: hour24 >= 12 ? 'PM' : 'AM',
  }
}

export function serializeReportDateTimeParts({
  date,
  hour,
  minute,
  period,
}: ReportDateTimeParts): string {
  const hour12 = Number(hour)
  const hour24 =
    period === 'PM' ? (hour12 % 12) + 12 : hour12 === 12 ? 0 : hour12

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(hour24)}:${pad(Number(minute))}`
}

export function toIndiaDateTimeValue(value: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value || ''

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get(
    'minute',
  )}`
}

export function formatReportDateTimeValue(value: string): string {
  const parts = parseReportDateTimeValue(value)
  if (!parts) return 'Select date and time'

  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parts.date)

  return `${dateLabel} · ${parts.hour}:${parts.minute} ${parts.period}`
}
