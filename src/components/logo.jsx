import React from 'react';

// CHANGE THIS VALUE TO: 'gemini', 'knot', or 'sunburst'
const CURRENT_STYLE = 'knot'; 

const Logo = () => {
  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      
      {/* --- OPTION 1: THE NEXUS V (Gemini Style) --- */}
      {CURRENT_STYLE === 'gemini' && (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white group-hover:text-blue-400 transition-colors duration-500" fill="currentColor">
            {/* A 4-pointed star shape morphed into a 'V' */}
            <path d="M12 22C12 22 10 14 2 12C10 10 12 2 12 2C12 2 14 10 22 12C14 14 12 22 12 22Z" />
            <circle cx="12" cy="12" r="2" className="text-black fill-current" />
          </svg>
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        </div>
      )}

      {/* --- OPTION 2: THE INFINITE KNOT (ChatGPT Style) --- */}
      {CURRENT_STYLE === 'knot' && (
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white group-hover:text-cyan-400 transition-transform duration-700 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      )}

      {/* --- OPTION 3: THE SUNBURST (Lucas/Screenshot Style) --- */}
      {CURRENT_STYLE === 'sunburst' && (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white group-hover:text-blue-400 transition-colors duration-300" fill="currentColor">
            {[...Array(12)].map((_, i) => (
              <rect key={i} x="11" y="0" width="2" height="6" rx="1" transform={`rotate(${i * 30} 12 12)`} />
            ))}
          </svg>
          <div className="absolute w-2 h-2 bg-white rounded-full group-hover:bg-blue-400 transition-colors" />
        </div>
      )}

      {/* --- TEXT LOGO --- */}
      <span className="text-xl font-black tracking-[0.2em] text-white font-['Inter'] group-hover:text-gray-200 transition-colors">
        VIKAS
      </span>
    </div>
  );
};

export default Logo;