import React, { useEffect, useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import Logo from './logo';

function Navbar() {
  
  const logo = useRef(null);
  const linksRef = useRef([]); 

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const t1 = gsap.timeline();
    t1.fromTo(logo.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    );

    t1.fromTo(linksRef.current,
      { y: -30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1 
      },
      "-=0.5" 
    );

  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Project', href: '#project' },
    { name: 'Certification', href: '#certificate' },
    { name: 'Contact', href: '#contact' },
  ];

  // Helper to add elements to the ref array
  const addToRefs = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-3" ref={logo}>
          <Logo/>
          
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <li 
              key={link.name}
              // 4. This callback function pushes each <li> into our ref array
              ref={addToRefs}
            >
              <a 
                href={link.href} 
                className="text-gray-300 hover:text-blue-400 font-medium transition-colors text-sm uppercase tracking-wider"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <ul className="flex flex-col p-6 space-y-4 text-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="block text-gray-300 hover:text-white text-lg font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;