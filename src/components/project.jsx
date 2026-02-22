import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Images
import ProjectImg1 from "../assets/project1.png";
import ProjectImg2 from "../assets/project2.png";
import ProjectImg3 from "../assets/project3.png";
import ProjectImg4 from "../assets/project4.png";

gsap.registerPlugin(ScrollTrigger);

const baseProjects = [
  {
    id: 1,
    title: "Property Listing Dashboard",
    category: "Properties",
    description: "Property listing dashboard for managing properties.",
    image: ProjectImg1,
    tech: ["React Native", "mongodb", "Express.js", "Node.js"],
    link: "https://propertyhunters.dpdns.org/"
  },
  {
    id: 2,
    title: "E-Commerce",
    category: "Web App",
    description: "A futuristic shopping platform featuring real-time 3D product rendering.",
    image: ProjectImg3,
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS", "express.js", "mongoose"],
    link: "https://myecom-2vo3.vercel.app/"
  },

  {
    id: 3,
    title: "Portfolio Listing site",
    category: "Web App",
    description: "Portfolio listing site for showcasing portfolio.",
    image: ProjectImg2,
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS", "express.js", "mongoose"],
    link: "https://assignment02-phi.vercel.app/"
  },
  {
    id: 4,
    title: "DroneTV",
    category: "Web App",
    description: "DroneTV is a platform for individuals or companies to list their profiles and connect with potential clients and list there products and services.",
    image: ProjectImg4,
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS", "express.js", "mongoose"],
    link: "https://dronetv.in"
  }
];

const projects = [...baseProjects, ...baseProjects, ...baseProjects];

export default function Projects() {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  // Use useLayoutEffect for GSAP animations to avoid layout shifts
  useLayoutEffect(() => {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({ smooth: true, lerp: 0.05 });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. Setup GSAP Context
    const ctx = gsap.context(() => {

      // Force a refresh to ensure start/end points are correct
      ScrollTrigger.refresh();

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", // Scroll distance
          scrub: 1,      // Smoothing
          pin: true,     // Pin the container
          invalidateOnRefresh: true, // Recalculate on resize
        }
      })
        .to(ringRef.current, {
          rotationY: -360,
          ease: "none"
        });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white relative font-sans w-full"
      id="project">

      {/* SCROLL CONTAINER */}
      {/* 'h-screen' ensures it fills the viewport exactly for the pinning to work */}
      <div ref={containerRef} className="h-screen w-full relative z-10 overflow-hidden">

        {/* Sticky Stage */}
        <div className="h-full w-full flex flex-col items-center justify-center">

          {/* Header */}
          <div className={`absolute top-12 text-center z-20 transition-opacity duration-500 ${activeProject ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-indigo-500 tracking-[0.2em] text-xs font-bold uppercase mb-2">Portfolio</h2>
            <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
          </div>

          {/* 3D RING STAGE */}
          <div
            className={`perspective-container relative mt-12 transition-all duration-700 ${activeProject ? 'blur-xl scale-90 opacity-50' : ''}`}
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d"
            }}
          >
            {/* TILTED RING */}
            <div
              ref={ringRef}
              className="ring w-36 h-56 relative"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(-15deg)"
              }}
            >
              {projects.map((project, i) => {
                const angle = (360 / projects.length) * i;
                const radius = 400;

                return (
                  <div
                    key={i}
                    onClick={() => setActiveProject(project)}
                    className="absolute top-0 left-0 w-full h-full cursor-pointer group"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* CARD */}
                    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-[#111] transition-all duration-500 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] group-hover:-translate-y-4">
                      {/* Image */}
                      <div className="h-3/4 w-full relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                      </div>
                      {/* Info */}
                      <div className="h-1/4 w-full p-4 flex flex-col justify-center bg-[#111]">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                          {project.category}
                        </p>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`absolute bottom-12 flex flex-col items-center gap-2 transition-opacity ${activeProject ? 'opacity-0' : 'opacity-50'}`}>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll to Rotate</span>
          </div>

        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setActiveProject(null)}
          ></div>

          <div className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            {/* Left: Image Showcase */}
            <div className="w-full md:w-3/5 h-1/2 md:h-full relative bg-gray-900 group">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden md:block"></div>

              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all"
              >
                <span>←</span> Back to Gallery
              </button>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative bg-[#0a0a0a]">
              <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest mb-4">
                Project 0{activeProject.id}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {activeProject.title}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
                {activeProject.description}
              </p>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.map((t, idx) => (
                      <span key={idx} className="px-3 py-1.5 text-xs border border-white/10 bg-white/5 rounded-md text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex gap-4">
                  <button onClick={() => window.open(activeProject.link, "_blank")} className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                    View Live Site
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}