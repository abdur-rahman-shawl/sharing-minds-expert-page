import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { legalDocuments } from "@/lib/legal-documents"
import { FileText, Mail, Shield } from "lucide-react"

type ContentElement =
  | { type: "section"; number: string; text: string }
  | { type: "subheading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "numbered-item"; number: string; text: string }
  | { type: "contact"; text: string; email: string }
  | { type: "paragraph"; text: string }

const SPECIAL_HEADINGS = new Set([
  "Our Commitment",
  "Expert Application Declaration",
  "Cookie Preference Statement",
  "Applicant",
  "Expert",
  "Verified Expert",
  "Founding Expert",
  "Expert Profile",
  "Client",
  "Expert Engagement",
  "Platform",
  "Relevant Professional Experience",
  "Demonstrable Expertise",
  "Measurable Contribution",
  "Professional Credibility",
  "Practical Judgment",
  "Relevance",
  "Matching Is a Relevance Assessment, Not a Guarantee",
  "Responsibility to Assess Suitability",
  "Technology and AI-Assisted Matching",
  "Continuous Improvement",
  "No Guarantee of Engagement Outcome",
  "A. Strictly Necessary Cookies",
  "B. Functional and Preference Cookies",
  "C. Analytics and Performance Cookies",
  "D. Advertising, Campaign and Attribution Cookies",
  "First-Party Cookies",
  "Third-Party Cookies",
  "Session Cookies",
  "Persistent Cookies",
  "Contact",
])

function parseContent(content: string): ContentElement[] {
  const blocks = content
    .split(/\r?\n\s*\r?\n/)
    .map(block => block.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(2)

  let isDeclaration = false

  return blocks.map(block => {
    if (block === "Expert Application Declaration") {
      isDeclaration = true
      return { type: "subheading", text: block }
    }

    const section = block.match(/^(\d+)\.\s+([^\n]+)$/)
    const emojiSection = block.match(/^(\d)\uFE0F\u20E3\s+(.+)$/)
    if (emojiSection) {
      return { type: "section", number: emojiSection[1], text: emojiSection[2] }
    }

    if (section && !isDeclaration) {
      return { type: "section", number: section[1], text: section[2] }
    }

    const numberedItem = block.match(/^(\d+)\.\s+(.+)$/)
    if (numberedItem) {
      return { type: "numbered-item", number: numberedItem[1], text: numberedItem[2] }
    }

    if (block.startsWith("- ")) {
      return { type: "bullet", text: block.slice(2) }
    }

    if (SPECIAL_HEADINGS.has(block)) {
      return { type: "subheading", text: block }
    }

    const email = block.match(/(?:Email:\s*)?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)
    if (email) {
      return { type: "contact", text: block, email: email[1] }
    }

    return { type: "paragraph", text: block }
  })
}

function effectiveDate(content: string) {
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line.toLowerCase().startsWith("effective date:"))
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%)]" />

        <header className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-24">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Trust &amp; Compliance
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Policies &amp; Legal
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Review the current SharingMinds terms, privacy, pricing, conduct and cookie
            policies. Each document is available below in full.
          </p>
          <nav aria-label="Policy documents" className="flex flex-wrap gap-2">
            {legalDocuments.map(document => (
              <a
                key={document.id}
                href={`#${document.id}`}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
              >
                <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                <span>{document.label}</span>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                  {effectiveDate(document.content)?.replace("Effective Date:", "").trim()}
                </Badge>
              </a>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {legalDocuments.map(document => {
              const elements = parseContent(document.content)
              const date = effectiveDate(document.content)

              return (
                <Card
                  key={document.id}
                  id={document.id}
                  className="scroll-mt-[120px] overflow-hidden border-slate-200/80 bg-white/95 shadow-lg shadow-indigo-100/50"
                >
                  <CardHeader className="space-y-3 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/60 px-5 sm:px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900 sm:text-2xl">
                          {document.label}
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                          {date} · Version {document.version}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 py-7 sm:px-8 sm:py-9">
                    <div className="space-y-4">
                      {elements.map((element, index) => {
                        if (element.type === "section") {
                          return (
                            <div key={index} className="flex items-start gap-3 pb-1 pt-6 first:pt-0">
                              <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 px-1.5 text-sm font-bold text-indigo-700">
                                {element.number}
                              </span>
                              <h2 className="pt-0.5 text-lg font-semibold text-slate-800">
                                {element.text}
                              </h2>
                            </div>
                          )
                        }

                        if (element.type === "subheading") {
                          return (
                            <h3
                              key={index}
                              className="border-b border-slate-100 pb-2 pt-5 text-lg font-semibold text-slate-800 first:pt-0"
                            >
                              {element.text}
                            </h3>
                          )
                        }

                        if (element.type === "bullet") {
                          return (
                            <div key={index} className="flex gap-3 pl-1 sm:pl-10">
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                              <p className="leading-7 text-slate-600">{element.text}</p>
                            </div>
                          )
                        }

                        if (element.type === "numbered-item") {
                          return (
                            <div key={index} className="flex gap-3 rounded-xl bg-slate-50 p-4 sm:ml-10">
                              <span className="font-semibold text-indigo-700">{element.number}.</span>
                              <p className="leading-7 text-slate-600">{element.text}</p>
                            </div>
                          )
                        }

                        if (element.type === "contact") {
                          return (
                            <div key={index} className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:ml-10">
                              <Mail className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                              <p className="leading-7 text-slate-700">
                                {element.text.replace(element.email, "")}
                                <a
                                  href={`mailto:${element.email}`}
                                  className="font-medium text-indigo-700 hover:underline"
                                >
                                  {element.email}
                                </a>
                              </p>
                            </div>
                          )
                        }

                        return (
                          <p key={index} className="leading-7 text-slate-600 sm:pl-10">
                            {element.text}
                          </p>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
