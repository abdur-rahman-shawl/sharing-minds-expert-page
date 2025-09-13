import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white shadow-sm px-4 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg viewBox="0 0 40 20" className="w-10 h-5 text-blue-600" fill="currentColor">
              <path d="M10 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-2.8 0-5.3-1.1-7.1-2.9C11.1 15.3 10 12.8 10 10zm-10 0c0 5.5 4.5 10 10 10 2.8 0 5.3-1.1 7.1-2.9C8.9 15.3 10 12.8 10 10S8.9 4.7 7.1 2.9C5.3 1.1 2.8 0 0 0c5.5 0 10 4.5 10 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">sharingminds</h1>
            <p className="text-xs text-gray-500 -mt-0.5">a human intelligence network</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Service
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
