import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'

import {
  buildExpertApplicationReportFilename,
  buildExpertApplicationWorkbook,
  escapeSpreadsheetText,
  expertApplicationReportRequestSchema,
  getApplicationStatusMeaning,
  parseIndiaDateTime,
  type ExpertApplicationReportData,
  type ExpertApplicationReportRow,
} from './expert-application-report'
import {
  formatReportDateTimeValue,
  parseReportDateTimeValue,
  serializeReportDateTimeParts,
  toIndiaDateTimeValue,
} from './report-date-time'

describe('expert application report date-time picker', () => {
  it('round-trips an IST wall-clock value without a browser timezone conversion', () => {
    const parts = parseReportDateTimeValue('2026-07-26T23:02')

    expect(parts).not.toBeNull()
    expect(parts?.hour).toBe('11')
    expect(parts?.minute).toBe('02')
    expect(parts?.period).toBe('PM')
    expect(parts && serializeReportDateTimeParts(parts)).toBe(
      '2026-07-26T23:02',
    )
  })

  it('handles noon, midnight, invalid dates, and the readable trigger label', () => {
    expect(parseReportDateTimeValue('2026-07-26T00:00')?.hour).toBe('12')
    expect(parseReportDateTimeValue('2026-07-26T00:00')?.period).toBe('AM')
    expect(parseReportDateTimeValue('2026-07-26T12:00')?.period).toBe('PM')
    expect(parseReportDateTimeValue('2026-02-31T12:00')).toBeNull()
    expect(formatReportDateTimeValue('2026-07-26T12:00')).toContain(
      '12:00 PM',
    )
  })

  it('formats an instant as an IST wall-clock picker value', () => {
    expect(toIndiaDateTimeValue(new Date('2026-07-26T09:00:00.000Z'))).toBe(
      '2026-07-26T14:30',
    )
  })
})

describe('expert application report range', () => {
  it('parses an India Standard Time wall-clock value into the correct instant', () => {
    expect(parseIndiaDateTime('2026-07-26T14:30')?.toISOString()).toBe(
      '2026-07-26T09:00:00.000Z',
    )
  })

  it('rejects impossible dates and reversed ranges', () => {
    expect(parseIndiaDateTime('2026-02-31T10:00')).toBeNull()

    const result = expertApplicationReportRequestSchema.safeParse({
      startAt: '2026-07-27T10:00',
      endAt: '2026-07-26T10:00',
    })

    expect(result.success).toBe(false)
  })
})

describe('expert application report formatting', () => {
  it('neutralizes spreadsheet formula prefixes without changing normal text', () => {
    expect(escapeSpreadsheetText('=HYPERLINK("https://example.com")')).toBe(
      '\'=HYPERLINK("https://example.com")',
    )
    expect(escapeSpreadsheetText('  +1+1')).toBe("'  +1+1")
    expect(escapeSpreadsheetText('Senior Product Leader')).toBe(
      'Senior Product Leader',
    )
  })

  it('provides plain-language status meanings', () => {
    expect(getApplicationStatusMeaning('DRAFT')).toContain('Not submitted')
    expect(getApplicationStatusMeaning('APPROVED')).toContain('accepted')
    expect(getApplicationStatusMeaning('IN_PROGRESS')).toContain(
      'account-backed registration',
    )
  })

  it('creates a deterministic, filesystem-safe filename', () => {
    const startAt = new Date('2026-07-01T18:30:00.000Z')
    const endAt = new Date('2026-07-02T18:30:00.000Z')

    expect(buildExpertApplicationReportFilename({ startAt, endAt })).toBe(
      'sharingminds-expert-applications-20260702-0000-to-20260703-0000-IST.xlsx',
    )
  })
})

describe('expert application workbook', () => {
  it('writes application and campaign worksheets with formula-safe values', async () => {
    const row: ExpertApplicationReportRow = {
      applicationId: '11111111-1111-4111-8111-111111111111',
      registeredAtIst: '2026-07-26 14:30:00 IST',
      registrationDateIst: '2026-07-26',
      registrationTimeIst: '14:30:00',
      registeredAtUtc: '2026-07-26T09:00:00.000Z',
      email: '=malicious@example.com',
      databaseStatus: 'SUBMITTED',
      statusMeaning: 'Submitted — application completed and waiting for review',
      recordBasis: 'Latest submitted revision 1',
      fullName: 'Example Expert',
    }
    const report: ExpertApplicationReportData = {
      range: {
        startAt: new Date('2026-07-25T18:30:00.000Z'),
        endAt: new Date('2026-07-26T18:30:00.000Z'),
      },
      generatedAt: new Date('2026-07-26T10:00:00.000Z'),
      rows: [row],
    }

    const output = await buildExpertApplicationWorkbook(report)
    const files = unzipSync(output)
    const workbookXml = strFromU8(files['xl/workbook.xml'])
    const applicationSheetXml = strFromU8(files['xl/worksheets/sheet2.xml'])
    const allXml = Object.entries(files)
      .filter(([name]) => name.endsWith('.xml'))
      .map(([, contents]) => strFromU8(contents))
      .join('\n')

    expect(output[0]).toBe(0x50)
    expect(output[1]).toBe(0x4b)
    expect(workbookXml).toContain('name="Summary"')
    expect(workbookXml).toContain('name="Applications"')
    expect(workbookXml).toContain('name="Status Guide"')
    expect(workbookXml).toContain('name="Campaign Performance"')
    expect(applicationSheetXml.match(/<row\b/g)).toHaveLength(2)
    expect(allXml).toContain("'=malicious@example.com")
    expect(applicationSheetXml).toContain('<pane')
  })
})
