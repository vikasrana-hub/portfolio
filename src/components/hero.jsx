import React, { useRef } from 'react'
import { Github, Linkedin, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import profile from '../assets/profile.png'


const Hero = () => {
  // refs for left and right divs
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from(leftRef.current, {
      x: -300,
      opacity: 0,
      duration: 1,
      delay:2
      
    }).from(
      rightRef.current,
      {
        x: 300,
        opacity: 0,
        duration: 1,
      },
      '-=0.8' // slightly overlap animations
    )
  }, { scope: leftRef }) // scope just leftRef is fine because both refs are inside same root

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black text-white overflow-hidden font-['Inter'] py-10 md:py-0">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#031836] to-[#0a4da3]" />
        <div className="absolute top-1/2 right-0 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-[#1a5fb4] opacity-20 blur-[80px] md:blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main Content Container - ALWAYS flex-row */}
      <div className="relative z-10 w-full max-w-6xl px-3 md:px-12 flex flex-row items-center justify-between gap-3 md:gap-10">
        
        {/* LEFT DIV: Text & Info */}
        <div ref={leftRef} className="flex-1 space-y-3 md:space-y-6 text-left">
          {/* ... (your left div content unchanged) */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1 rounded-full backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
            </span>
            <span className="text-[8px] md:text-xs font-medium text-gray-300 uppercase tracking-wide">Available</span>
          </div>

          <div>
            <h1 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-4xl leading-snug mb-1 md:mb-2 text-white">
              Vikas Rana
            </h1>
            <h2 className="text-[10px] sm:text-sm md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Full Stack MERN Developer
            </h2>
          </div>

          <p className="text-gray-300 text-[9px] sm:text-xs md:text-base leading-relaxed max-w-lg">
            I am a Full Stack Developer and AI Systems Engineer passionate about building high-performance, scalable web applications and real-time AI solutions. With a strong foundation in the MERN stack, I specialize in creating seamless user experiences and robust backend architectures.
            <span className="text-white font-semibold"> 6 months experience</span>.
          </p>

          <div className="flex justify-start gap-4 py-1">
            <div className="text-left">
              <span className="block text-sm md:text-2xl font-bold text-white">06+</span>
              <span className="text-[8px] md:text-xs text-gray-400 uppercase">Months</span>
            </div>
            <div className="w-px bg-gray-700"></div>
            <div className="text-left">
              <span className="block text-sm md:text-2xl font-bold text-white">Live</span>
              <span className="text-[8px] md:text-xs text-gray-400 uppercase">Projects</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 pt-1">
            <button 
            className="flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 md:px-6 md:py-3 rounded md:rounded-lg text-[9px] md:text-base font-semibold transition-all shadow-lg">
              My Work <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT DIV: Picture - Scaled down for mobile */}
        <div ref={rightRef} className="flex-shrink-0 w-[35%] md:w-auto">
          <div className="relative w-full md:w-[320px] aspect-[3/4] md:h-[400px]">
             {/* Decorative Border behind */}
             <div className="absolute inset-0 border border-dashed border-white/30 rounded-lg md:rounded-2xl translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4"></div>
             
             {/* Image Container */}
             <div className="absolute inset-0 bg-gray-800 rounded-lg md:rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                {/* PUT YOUR IMAGE URL HERE */}
                <img 
                  src={profile}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
