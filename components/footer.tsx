import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex flex-wrap justify-center gap-8 text-sm">
          <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Homepage
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Service
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
        </nav>

        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">© 2024 SharingMinds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
