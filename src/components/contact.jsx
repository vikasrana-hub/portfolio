import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const container = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Animation for the Header
      gsap.from(".reveal-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%", 
        }
      });

      // 2. Form Slide-in Animation
      gsap.from(formRef.current, {
        x: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message Sent!");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div id="contact"
     ref={container} className="bg-[#050505] min-h-screen text-white w-full py-32 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background Glow (Optional subtle gradient) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* LEFT: Text & Info */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <h2 className="reveal-text text-indigo-500 font-mono text-xs uppercase tracking-widest mb-6">
            Contact
          </h2>
          <h1 className="reveal-text text-5xl md:text-7xl font-bold leading-tight mb-8">
            Let's start a <br />
            <span className="text-gray-500">project together.</span>
          </h1>
          <p className="reveal-text text-gray-400 text-lg leading-relaxed max-w-md mb-12">
            Interested in working together? We should queue up a time to chat. I’ll buy the coffee.
          </p>

          {/* Contact Details */}
          <div className="reveal-text space-y-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-lg text-gray-300 group-hover:text-white transition-colors">rvikashrana07@gmail.com</span>
            </div>
            
            
          </div>
        </div>

        {/* RIGHT: The Form */}
        <div className="lg:w-1/2">
          <form 
            ref={formRef} 
            onSubmit={handleSubmit}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative group"
          >
            {/* Subtle Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            <div className="space-y-8 relative z-10">
              
              {/* Name Input */}
              <div className="relative">
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-indigo-500 transition-colors peer placeholder-transparent" 
                  placeholder="Name"
                />
                <label className="absolute left-0 top-4 text-gray-500 text-lg transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-indigo-400 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-indigo-400 cursor-text">
                  What's your name?
                </label>
              </div>

              {/* Email Input */}
              <div className="relative">
                <input 
                  type="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-indigo-500 transition-colors peer placeholder-transparent" 
                  placeholder="Email"
                />
                <label className="absolute left-0 top-4 text-gray-500 text-lg transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-indigo-400 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-indigo-400 cursor-text">
                  What's your email?
                </label>
              </div>

              {/* Message Input */}
              <div className="relative">
                <textarea 
                  name="message" 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-indigo-500 transition-colors peer placeholder-transparent resize-none" 
                  placeholder="Message"
                ></textarea>
                <label className="absolute left-0 top-4 text-gray-500 text-lg transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-indigo-400 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-indigo-400 cursor-text">
                  Tell me about your project...
                </label>
              </div>

              {/* Submit Button */}
              <button 
                disabled={isSubmitting}
                className="w-full bg-white text-black font-bold text-lg py-5 rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 group/btn"
              >
                {isSubmitting ? (
                   <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Send Message 
                    <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}