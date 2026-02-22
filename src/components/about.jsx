import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Database, Globe, Server, Terminal, Cpu } from 'lucide-react';

// Register ScrollTrigger so animations happen when you scroll down
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  
  // Animation Logic
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Animate the text and skills staggering up
      gsap.from(".about-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Animation starts when section is 80% in view
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Skill Data mapped from your Resume
  const skills = [
    { name: "React.js", icon: <Globe size={20} />, color: "text-blue-400" },
    { name: "Next.js", icon: <Code2 size={20} />, color: "text-white" },
    { name: "Node.js", icon: <Server size={20} />, color: "text-green-500" },
    { name: "MongoDB", icon: <Database size={20} />, color: "text-green-400" },
    { name: "Tailwind", icon: <Code2 size={20} />, color: "text-cyan-400" },
    { name: "JavaScript", icon: <Terminal size={20} />, color: "text-yellow-400" },
    { name: "Python", icon: <Terminal size={20} />, color: "text-blue-300" },
  ];

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full py-20 bg-black text-white overflow-hidden font-['Inter']"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0a4da3] opacity-10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 items-center">
        
        {/* LEFT SIDE: Biography */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="about-item text-3xl md:text-5xl font-['Press_Start_2P'] leading-tight">
            ABOUT <span className="text-blue-500">ME</span>
          </h2>
          
          <div className="about-item space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
            <p>
              I am a motivated <strong className="text-white">Full Stack Developer</strong> based in Dehradun, 
              passionate about solving real-world problems through efficient and scalable solutions. 
              Currently pursuing my B.Tech in Computer Science at Uttarakhand Technical University.
            </p>

            <p>
              I specialize in the <strong className="text-white">MERN Stack (MongoDB, Express, React, Node)</strong> and Next.js.
              Recently, I completed a <strong className="text-blue-400">6-month internship at iPage UMS</strong>, 
              where I gained hands-on experience working on live projects and refining my backend and frontend skills.
            </p>
            
            <p>
              Whether it's building an e-commerce platform like <em>Inferno Cart</em> or optimizing database queries, 
              I focus on writing quality code and intuitive user experiences.
            </p>
          </div>

          {/* Education & Internship Highlight Chips */}
          <div className="about-item flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs md:text-sm text-gray-300">
              🎓 B.Tech CSE (2021-2025)
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-lg text-xs md:text-sm text-blue-200">
              💼 Intern @ iPage UMS
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Skills Grid */}
        <div className="about-item flex-1 w-full">
          <h3 className="text-xl font-bold mb-6 text-center md:text-left text-gray-200 flex items-center gap-2 justify-center md:justify-start">
             Technical Arsenal
             <div className="h-px w-20 bg-gray-700"></div>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="group relative bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-blue-500/50"
              >
                {/* Icon Container with Glow on Hover */}
                <div className={`${skill.color} p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors`}>
                  {skill.icon}
                </div>
                
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;