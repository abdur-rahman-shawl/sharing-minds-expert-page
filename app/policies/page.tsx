import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { legalDocuments } from "@/lib/legal-documents"
import { Shield, FileText } from "lucide-react"

const formatParagraphs = (content: string) =>
  content
    .split(/\r?\n\r?\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)

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
              const paragraphs = formatParagraphs(doc.content)
              const effectiveDate = getEffectiveDate(doc.content)

              return (
                <Card
                  key={doc.id}
                  id={doc.id}
                  className="border-slate-200/80 bg-white/90 shadow-lg shadow-indigo-100/50"
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
                  <CardContent className="space-y-4 py-6 text-slate-700 leading-7">
                    {paragraphs.map((paragraph, idx) => (
                      <p key={idx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
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
