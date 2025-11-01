export default function Footer() {
  return (
    <footer className="w-full mt-12 border-t border-[#2b2b2b] bg-[#0b0b0b] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-white font-bold mb-3">VidPulse</h3>
          <p className="text-sm">Stream. Create. Analyze.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Browse</h4>
          <ul className="space-y-1 text-sm">
            <li><a className="hover:text-[#E50914]" href="/">Home</a></li>
            <li><a className="hover:text-[#E50914]" href="/upload">Upload</a></li>
            <li><a className="hover:text-[#E50914]" href="/studio">Studio</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Account</h4>
          <ul className="space-y-1 text-sm">
            <li><a className="hover:text-[#E50914]" href="/login">Login</a></li>
            <li><a className="hover:text-[#E50914]" href="/register">Register</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><span className="hover:text-[#E50914] cursor-pointer">Terms</span></li>
            <li><span className="hover:text-[#E50914] cursor-pointer">Privacy</span></li>
          </ul>
        </div>
      </div>
      <div className="px-6 py-4 text-center text-xs border-t border-[#2b2b2b]">© {new Date().getFullYear()} VidPulse</div>
    </footer>
  );
}


