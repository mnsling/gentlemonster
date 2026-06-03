import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const Home = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchLatestCampaign = async () => {
      const { data } = await supabase
        .from('home')
        .select('video, name, images') 
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setVideoUrl(data[0].video || '');
        setCampaignName(data[0].name || '');
        
        const rawImages = data[0].images;
        if (Array.isArray(rawImages)) {
          setCarouselImages(rawImages);
        } else if (typeof rawImages === 'string') {
          setCarouselImages(rawImages.split(',').map(url => url.trim()));
        }
      }
    };

    fetchLatestCampaign();
  }, []);

  return (
    <div className='w-full min-h-screen bg-[#fafafa] text-black select-none overflow-x-hidden flex flex-col justify-between antialiased'>
      
      <div>
        {/* ========================================================================= */}
        {/* HERO VISUAL CANVAS (80% VIEWPORT WITH INTEGRATED LUXURY MASK)              */}
        {/* ========================================================================= */}
        <div className='w-full h-[85vh] relative overflow-hidden bg-black group/hero'>
          {videoUrl && (
            <video
              key={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className='w-full h-full object-cover pointer-events-none scale-[1.01] transition-transform duration-[3000ms] group-hover/hero:scale-105'
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          {/* Luxury ambient dark overlay gradient shield */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none z-10" />

          {/* HIGH-FASHION EDITORIAL HERO CLUSTER (Pinned Asymmetrically Bottom-Left) */}
          <div className='font-host absolute bottom-10 md:bottom-16 left-6 md:left-16 right-6 z-20 flex flex-col items-start text-left max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out'>
            
            <div className='text-white/60 text-[10px] tracking-[0.3em] uppercase font-mono mb-3 flex items-center gap-2'>
              <span className='w-1.5 h-1.5 bg-red-500 rounded-full animate-ping' />
              NEW ARRIVAL // CAMPAIGN LAUNCH
            </div>

            {campaignName && (
              <h1 className='text-white text-[38px] sm:text-[54px] lg:text-[72px] uppercase tracking-tight italic leading-[0.85] mb-8 max-w-3xl drop-shadow-sm font-sans whitespace-pre-line'>
                {campaignName.replace(' COLLECTION', '')} <br />
              </h1>
            )}

            {/* Premium action rows */}
            <div className='flex flex-wrap items-center gap-4 w-full md:w-auto'>
              <button className='px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] bg-white text-black rounded-sm shadow-xl hover:bg-neutral-900 hover:text-white transition-all duration-300 min-w-[160px]'>
                View Campaign
              </button>
              <button className='px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] bg-transparent text-white rounded-sm border border-white/40 backdrop-blur-xs hover:border-white hover:bg-white/10 transition-all duration-300 min-w-[160px]'>
                Shop Now
              </button>
            </div>

          </div>
        </div>

        {/* MID-SECTION DECORATIVE DATA STRIP */}
        <div className='w-full px-6 md:px-16 py-4 bg-white border-b border-neutral-100 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase'>
          <span>[ GRID VIEW 01 ]</span>
          <span className='animate-pulse text-neutral-600'>SWIPE OVERLOOK CONTINUITY ➔</span>
          <span className='hidden sm:inline'>MANILA / SEOUL / TOKYO</span>
        </div>

        {/* ========================================================================= */}
        {/* ARCHITECTURAL TICKER LOOKBOOK STREAM                                       */}
        {/* ========================================================================= */}
        <div className='w-full bg-white py-16 lg:py-24 overflow-hidden'>
          
          <style>{`
            @keyframes modernScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-modern-loop {
              display: flex;
              width: max-content;
              animation: modernScroll 32s linear infinite;
            }
            .animate-modern-loop:hover {
              animation-play-state: paused;
            }
          `}</style>

          {carouselImages.length > 0 ? (
            <div className='w-full overflow-hidden relative group/carousel cursor-ew-resize'>
              <div className='animate-modern-loop gap-6 lg:gap-8 flex items-center'>
                
                {/* Track Strip One */}
                {carouselImages.map((imgUrl, index) => (
                  <div 
                    key={`modern-set1-${index}`}
                    className='w-[70vw] md:w-[45vw] lg:w-[38vw] aspect-[11/14] bg-neutral-50 flex-shrink-0 overflow-hidden relative group/card border border-neutral-100'
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Editorial Look ${index + 1}`} 
                      className='w-full h-full object-cover scale-[1.01] transition-transform duration-1000 ease-out group-hover/card:scale-105 filter grayscale hover:grayscale-0 transition-all'
                    />
                    <div className='absolute bottom-4 left-4 font-mono text-[9px] text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 tracking-widest uppercase opacity-0 group-hover/card:opacity-100 transition-opacity duration-300'>
                      LOOK_0{index + 1} // 2026
                    </div>
                  </div>
                ))}

                {/* Seamless Continuous Mirror Repeat Track */}
                {carouselImages.map((imgUrl, index) => (
                  <div 
                    key={`modern-set2-${index}`}
                    className='w-[70vw] md:w-[45vw] lg:w-[38vw] aspect-[11/14] bg-neutral-50 flex-shrink-0 overflow-hidden relative group/card border border-neutral-100'
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Editorial Look Duplicate ${index + 1}`} 
                      className='w-full h-full object-cover scale-[1.01] transition-transform duration-1000 ease-out group-hover/card:scale-105 filter grayscale hover:grayscale-0 transition-all'
                    />
                    <div className='absolute bottom-4 left-4 font-mono text-[9px] text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 tracking-widest uppercase opacity-0 group-hover/card:opacity-100 transition-opacity duration-300'>
                      LOOK_0{index + 1} // MIRROR
                    </div>
                  </div>
                ))}

              </div>
            </div>
          ) : (
            <div className='w-full h-[25vh] flex items-center justify-center text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-mono'>
              Media assets streaming offline
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-END REDESIGNED LUXURY FOOTER                                         */}
      {/* ========================================================================= */}
      <footer className='w-full bg-[#1c1c1c] text-[#a3a3a3] font-sans px-6 md:px-16 pt-20 pb-12 text-[11px] md:text-[12px] tracking-tight border-t border-neutral-800 relative z-30'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-4 items-start'>
          
          {/* Brand Grid Accent Label */}
          <div className='md:col-span-5 flex flex-col justify-between h-full min-h-[80px]'>
            <div className='text-white font-bold tracking-[0.22em] text-[13px] uppercase font-sans'>
              GENTLE MONSTER
            </div>
            <p className='text-neutral-500 font-mono text-[9px] max-w-xs mt-2 leading-relaxed tracking-wider uppercase'>
              Experimental Eyewear concept framework. Built upon global structural collaborations.
            </p>
          </div>

          {/* ① LINKS NAVIGATION GRID */}
          <div className='md:col-span-2 flex flex-col gap-4'>
            <span className='font-mono font-bold text-[10px] tracking-[0.2em] text-white/50 select-none uppercase'>① LINKS</span>
            <div className='flex flex-col gap-2.5 font-normal text-neutral-400'>
              <a href="#events" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Events</a>
              <a href="#products" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Products</a>
              <a href="#collaborations" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Collaborations</a>
              <a href="#stores" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Stores</a>
            </div>
          </div>

          {/* ② FOLLOW MATRIX */}
          <div className='md:col-span-2 flex flex-col gap-4'>
            <span className='font-mono font-bold text-[10px] tracking-[0.2em] text-white/50 select-none uppercase'>② FOLLOW</span>
            <div className='flex flex-col gap-2.5 font-normal text-neutral-400'>
              <a href="#facebook" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Facebook</a>
              <a href="#instagram" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Instagram</a>
              <a href="#youtube" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Youtube</a>
              <a href="#tiktok" className='hover:text-white transition duration-300 hover:translate-x-1 inline-block transform'>Tiktok</a>
            </div>
          </div>

          {/* ③ CONTACT DIRECTORY */}
          <div className='md:col-span-3 flex flex-col gap-4'>
            <span className='font-mono font-bold text-[10px] tracking-[0.2em] text-white/50 select-none uppercase'>③ CONTACT</span>
            <div className='flex flex-col gap-4 font-normal text-neutral-400'>
              <div>
                <p className='text-white font-semibold tracking-wide'>Mike Nicklaus S. Ling</p>
                <p className='text-neutral-500 text-[11px] mt-0.5'>Manila, Philippines 8000</p>
              </div>
              <div className='font-mono text-[11px] tracking-tight space-y-1.5 pt-1 border-t border-neutral-800/60'>
                <p className='hover:text-white transition select-all text-neutral-300'>m.nicklausling@gmail.com</p>
                <p className='select-all text-neutral-400'>+63 920 611 0289</p>
              </div>
            </div>
          </div>

        </div>

        {/* ④ EDITORIAL MINIMAL NEWSLETTER INPUT ROW */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 mt-20 pt-8 border-t border-neutral-800/80 items-center'>
          <div className='hidden md:block md:col-span-5' />
          
          <div className='md:col-span-7 flex flex-col sm:flex-row sm:items-center gap-6 w-full'>
            <span className='font-mono font-bold text-[10px] tracking-[0.2em] text-white/50 select-none uppercase whitespace-nowrap'>
              ④ NEWSLETTER
            </span>
            <form onSubmit={(e) => e.preventDefault()} className='flex-1 flex items-center relative border-b border-neutral-700 pb-2 group focus-within:border-white transition-colors duration-300'>
              <span className='text-neutral-600 text-[10px] mr-3 select-none transition-colors group-focus-within:text-white'>➔</span>
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL ADDRESS" 
                className='w-full bg-transparent border-none text-[11px] tracking-[0.15em] uppercase placeholder-neutral-600 text-white focus:outline-none font-mono'
              />
              <button type="submit" className='text-[10px] font-bold text-neutral-400 hover:text-white tracking-[0.2em] uppercase transition-colors duration-300 ml-4 bg-neutral-800/50 px-4 py-1.5 rounded-xs hover:bg-white hover:text-black'>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* METRICS TIMESTAMP BAR */}
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-20 text-[10px] text-neutral-600 tracking-[0.2em] font-mono uppercase gap-4 select-none border-t border-neutral-800/40 pt-6'>
          <div className='flex items-center gap-3'>
            <span className='text-neutral-400'>TYO</span>
            <span className='text-neutral-300'>06:01:38</span>
            <span className='px-1.5 py-0.5 bg-neutral-800 text-neutral-400 text-[9px] font-medium tracking-widest rounded-sm'>
              CLOSED
            </span>
          </div>
          <div className='text-neutral-500 text-[9px]'>
            © 2026 NICKLAUS LING // ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home;