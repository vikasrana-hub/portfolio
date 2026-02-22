import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// ... (Keep your imports as they are)
import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import BackImage1 from "../assets/certificate 1.jpeg";
import BackImage2 from "../assets/ipage.jpeg";
import BackImage3 from "../assets/certificate 1.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function Certificate() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const cardsRef = useRef([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkImages = async () => {
      try {
        const images = [Image1, Image2, Image3, BackImage1, BackImage2, BackImage3];
        await Promise.all(
          images.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setIsReady(true);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsReady(true);
      }
    };
    checkImages();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const lenis = new Lenis({ smooth: true, lerp: 0.08 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Only run animation on tablets and desktops (min-width: 768px)
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "center center",
            end: "+=150%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(containerRef.current, { gap: "30px", duration: 1, ease: "power2.out" })
          .to("#card-1", { x: -30, duration: 1, ease: "power2.out" }, "<")
          .to("#card-3", { x: 30, duration: 1, ease: "power2.out" }, "<")
          .to(cardsRef.current, { borderRadius: "20px", duration: 1 }, "<")
          .to(cardsRef.current, {
            rotationY: 180,
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.inOut",
          })
          .to(["#card-1", "#card-3"], {
            y: 40,
            rotationZ: (i) => (i === 0 ? -12 : 12),
            duration: 1.5,
            ease: "power2.inOut",
          }, "<+=0.2");
      });
      
      // On mobile, matchMedia will simply not run the block above, 
      // letting the CSS handle the static layout.
    }, triggerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, [isReady]);

  const cards = [
    { id: 1, backImg: BackImage1, title: "Google Coursera", subtitle: "Python Certification", description: "Python Course designed by Google" },
    { id: 2, backImg: BackImage2, title: "Dronetv Internship", subtitle: "MERN Stack Developer", description: "Completion of internship at Dronetv" },
    { id: 3, backImg: BackImage3, title: "Google Coursera", subtitle: "Python Certification", description: "Python Course designed by Google" },
  ];

  if (!isReady) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden" id="certificate">
      <style>{`
        .perspective-container { perspective: 1200px; }
        .card-container { transform-style: preserve-3d; will-change: transform; }
        .card-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: inherit; overflow: hidden; }
        .card-back { transform: rotateY(180deg); background: #111; border: 1px solid #333; }
        
        /* Mobile specific overrides */
        @media (max-width: 767px) {
          .mobile-stack {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 0 1rem;
            height: auto !important;
          }
          .mobile-card {
            position: relative !important;
            height: 400px !important;
            width: 100% !important;
            transform: none !important;
          }
          .mobile-card .card-face {
            position: relative !important;
            transform: none !important;
            backface-visibility: visible !important;
          }
          .mobile-card .card-front { display: none; } /* Hide front on mobile */
          .mobile-card .card-back { transform: none !important; }
        }
      `}</style>

      <section className="py-24 px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-medium text-center mb-4">My Certifications</h1>
        <p className="text-gray-400 text-center max-w-md text-sm md:text-base">
          {window.innerWidth < 768 ? "View my credentials below" : "Scroll down to reveal credentials"}
        </p>
      </section>

      <section
        ref={triggerRef}
        className="h-auto md:h-[80vh] flex items-center justify-center relative w-full mb-20"
      >
        <div
          ref={containerRef}
          className="mobile-stack flex perspective-container w-full md:w-[900px] aspect-auto md:aspect-[900/520] gap-0 relative mx-auto"
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              id={`card-${card.id}`}
              ref={(el) => (cardsRef.current[i] = el)}
              className="mobile-card relative flex-1 card-container cursor-pointer"
              style={{
                borderRadius: "20px",
              }}
            >
              {/* Front Side (Desktop Only) */}
              <div className="card-face card-front hidden md:block">
                <img src={Image1} alt="Front" className="w-full h-full object-cover" />
              </div>

              {/* Back Side (The Actual Certificate) */}
              <div className="card-face card-back">
                <div className="w-full h-full flex flex-col p-4">
                  <div className="flex-1 relative mb-4 overflow-hidden rounded-lg bg-gray-900 flex items-center justify-center">
                    <img src={card.backImg} alt={card.title} className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                    <p className="text-indigo-400 text-sm font-medium mb-2">{card.subtitle}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}