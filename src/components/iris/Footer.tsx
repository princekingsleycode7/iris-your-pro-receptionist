export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-10 px-6 md:px-10 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 max-w-sm">
            <div className="text-lg font-black tracking-[0.3em] font-[family-name:var(--font-display)] mb-5">
              TESLA
            </div>
            <p className="text-sm text-tesla-gray leading-relaxed">
              Revolutionizing customer service through superior AI robotics and
              neural voice synthesis. Designed in California.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Product
            </h4>
            <ul className="text-sm space-y-2.5 text-tesla-gray">
              <li><a href="#" className="hover:text-tesla-red transition-colors">Hardware</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Software</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Company
            </h4>
            <ul className="text-sm space-y-2.5 text-tesla-gray">
              <li><a href="#" className="hover:text-tesla-red transition-colors">Elon Musk</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Tesla AI</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-tesla-red transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Oversized bold wordmark */}
        <div className="select-none pointer-events-none overflow-hidden">
          <h2 className="text-[22vw] md:text-[16vw] leading-[0.85] font-black tracking-[-0.04em] font-[family-name:var(--font-display)] text-tesla-dark/[0.06] whitespace-nowrap text-center">
            IRIS BY TESLA
          </h2>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 flex flex-wrap justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-tesla-dark/40">
          <span>Tesla &copy; 2026</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-tesla-red">Privacy &amp; Legal</a>
            <a href="#" className="hover:text-tesla-red">Contact</a>
            <a href="#" className="hover:text-tesla-red">Locations</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
