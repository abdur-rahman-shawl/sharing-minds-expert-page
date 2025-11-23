import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center sm:px-4">
        <nav className="flex w-full flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <Link href="/" className="font-medium transition-colors hover:text-blue-600">
            Homepage
          </Link>
          <Link href="/service" className="font-medium transition-colors hover:text-blue-600">
            Service
          </Link>
          <Link href="/about" className="font-medium transition-colors hover:text-blue-600">
            About Us
          </Link>
          <Link href="/contact" className="font-medium transition-colors hover:text-blue-600">
            Contact
          </Link>
        </nav>

        <div className="w-full border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 sm:text-sm">© 2024 SharingMinds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
