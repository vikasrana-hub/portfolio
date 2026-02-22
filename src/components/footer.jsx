import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-black text-white w-full pt-20 pb-10 px-4 md:px-12 border-t border-white/10 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto flex flex-col justify-between h-full">
        
        {/* TOP SECTION: Links & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          
          {/* 1. Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Sitemap</h3>
            {['Home', 'About', 'Projects', 'Certificates', 'Contact'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="text-lg font-medium hover:text-indigo-400 transition-colors w-fit"
              >
                {link}
              </a>
            ))}
          </div>

          

          {/* 3. Back to Top CTA */}
          <div className="md:ml-auto flex flex-col items-end gap-6">
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              <span className="text-sm font-bold uppercase tracking-wide">Back to Top</span>
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: Info & Big Text */}
        <div className="flex flex-col gap-8">
          
          {/* Metadata Row */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm border-t border-white/10 pt-8 gap-4">
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Open to work</span>
            </div>

            <div className="flex items-center gap-6">
              <span>Based in India</span>
              <span>{time} IST</span>
            </div>

            <div>
              &copy; 2026 Vikas Rana. All Rights Reserved.
            </div>
          </div>

          {/* Huge Signature Text */}
          <h1 className="text-[12vw] leading-none font-bold text-center tracking-tighter text-white/10 select-none pointer-events-none mt-4">
            Vikas
          </h1>
        </div>

      </div>
    </footer>
  );
}