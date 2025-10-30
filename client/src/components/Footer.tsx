export default function Footer() {
  return (
    <footer className="w-full mt-12 border-t border-[#e5e7eb] bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-[#111827] font-bold mb-3">StreamFlix</h3>
          <p className="text-sm">Stream. Create. Analyze.</p>
        </div>
        <div>
          <h4 className="text-[#111827] font-semibold mb-2">Browse</h4>
          <ul className="space-y-1 text-sm">
            <li><a className="hover:text-[#2563EB]" href="/">Home</a></li>
            <li><a className="hover:text-[#2563EB]" href="/upload">Upload</a></li>
            <li><a className="hover:text-[#2563EB]" href="/studio">Studio</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#111827] font-semibold mb-2">Account</h4>
          <ul className="space-y-1 text-sm">
            <li><a className="hover:text-[#2563EB]" href="/login">Login</a></li>
            <li><a className="hover:text-[#2563EB]" href="/register">Register</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#111827] font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><span className="hover:text-[#2563EB] cursor-pointer">Terms</span></li>
            <li><span className="hover:text-[#2563EB] cursor-pointer">Privacy</span></li>
          </ul>
        </div>
      </div>
      <div className="px-6 py-4 text-center text-xs border-t border-[#e5e7eb]">© {new Date().getFullYear()} StreamFlix</div>
    </footer>
  );
}


