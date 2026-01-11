import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { legalDocuments } from "@/lib/legal-documents"
import { Shield, FileText, Mail } from "lucide-react"

// Parse content into structured elements
type ContentElement =
  | { type: 'title'; text: string }
  | { type: 'subtitle'; text: string }
  | { type: 'section-heading'; number: string; text: string }
  | { type: 'emoji-heading'; emoji: string; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'contact'; email: string }
  | { type: 'paragraph'; text: string }

const parseContent = (content: string): ContentElement[] => {
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const elements: ContentElement[] = []

  // Skip title and effective date (handled in header)
  let startIdx = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().startsWith('effective date') ||
      lines[i].toLowerCase().includes('a product of')) {
      startIdx = i + 1
    } else if (i > 2) {
      break
    }
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]

    // Numbered section heading (e.g., "1. Title" or "10. Title")
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      elements.push({ type: 'section-heading', number: numberedMatch[1], text: numberedMatch[2] })
      continue
    }

    // Emoji numbered heading (e.g., "1️⃣ Title")
    const emojiMatch = line.match(/^([0-9️⃣]+[️⃣]?)\s+(.+)$/)
    if (emojiMatch && /[️⃣]/.test(line)) {
      elements.push({ type: 'emoji-heading', emoji: emojiMatch[1], text: emojiMatch[2] })
      continue
    }

    // Contact email
    const emailMatch = line.match(/📧\s*(\S+@\S+)/)
    if (emailMatch) {
      elements.push({ type: 'contact', email: emailMatch[1] })
      continue
    }

    // Simple heading (no number, short, ends with specific keywords or is all caps-like)
    if (line.length < 50 && !line.includes('.') &&
      (line.endsWith('Terms') || line.endsWith('Policy') ||
        line.startsWith('Welcome') || line.startsWith('Our Commitment') ||
        line === 'Contact' || line.endsWith('Conduct'))) {
      elements.push({ type: 'subtitle', text: line })
      continue
    }

    // Regular paragraph
    elements.push({ type: 'paragraph', text: line })
  }

  return elements
}

const getEffectiveDate = (content: string) =>
  content
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line.toLowerCase().startsWith("effective date"))

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%)]" />

        <section className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
            <Shield className="h-4 w-4" />
            Trust & Compliance
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Policies & Legal
          </h1>
          <p className="max-w-3xl text-lg text-slate-600">
            Review our public policies, including Privacy, Terms, Pricing, and Community Conduct.
            We keep these documents accessible and transparent for every member of SharingMinds.
          </p>
          <div className="flex flex-wrap gap-2">
            {legalDocuments.map(doc => {
              const effectiveDate = getEffectiveDate(doc.content)
              return (
                <a
                  key={doc.id}
                  href={`#${doc.id}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
                >
                  <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                  <span>{doc.label}</span>
                  {effectiveDate && (
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {effectiveDate.replace("Effective Date:", "").trim()}
                    </Badge>
                  )}
                </a>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {legalDocuments.map(doc => {
              const elements = parseContent(doc.content)
              const effectiveDate = getEffectiveDate(doc.content)

              return (
                <Card
                  key={doc.id}
                  id={doc.id}
                  className="border-slate-200/80 bg-white/90 shadow-lg shadow-indigo-100/50 overflow-hidden"
                >
                  <CardHeader className="space-y-3 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-900">{doc.label}</CardTitle>
                        {effectiveDate && (
                          <p className="text-sm text-slate-500">{effectiveDate}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="space-y-6">
                      {elements.map((element, idx) => {
                        switch (element.type) {
                          case 'subtitle':
                            return (
                              <h3 key={idx} className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">
                                {element.text}
                              </h3>
                            )
                          case 'section-heading':
                            return (
                              <div key={idx} className="flex items-start gap-3 mt-6 first:mt-0">
                                <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                                  {element.number}
                                </span>
                                <h4 className="text-lg font-semibold text-slate-800 pt-0.5">
                                  {element.text}
                                </h4>
                              </div>
                            )
                          case 'emoji-heading':
                            return (
                              <div key={idx} className="flex items-start gap-3 mt-6 first:mt-0">
                                <span className="text-xl">{element.emoji}</span>
                                <h4 className="text-lg font-semibold text-slate-800">
                                  {element.text}
                                </h4>
                              </div>
                            )
                          case 'contact':
                            return (
                              <div key={idx} className="flex items-center gap-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <Mail className="h-5 w-5 text-indigo-600" />
                                <a
                                  href={`mailto:${element.email}`}
                                  className="text-indigo-700 font-medium hover:text-indigo-800 hover:underline"
                                >
                                  {element.email}
                                </a>
                              </div>
                            )
                          case 'paragraph':
                          default:
                            return (
                              <p key={idx} className="text-slate-600 leading-7 pl-0 sm:pl-10">
                                {element.text}
                              </p>
                            )
                        }
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
