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
    <div className='w-full min-h-screen bg-white select-none overflow-x-hidden flex flex-col justify-between'>
      
      <div>
        {/* ========================================================================= */}
        {/* TOP SECTION: HERO VIDEO PLAYBACK (80% VIEWPORT HEIGHT)                      */}
        {/* ========================================================================= */}
        <div className='w-full h-[80vh] relative overflow-hidden bg-black'>
          {videoUrl && (
            <video
              key={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className='w-full h-full object-cover pointer-events-none'
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          {/* ========================================================================= */}
          {/* BRAND INTERACTIVE LAYER (Floats at the absolute bottom of the video)       */}
          {/* ========================================================================= */}
          <div className='absolute bottom-12 left-0 w-full flex flex-col items-center justify-center text-center px-6 z-20 font-host animate-in fade-in slide-in-from-bottom-4 duration-700'>
            
            {/* Dynamic Collection Title from Supabase */}
            {campaignName && (
              <h1 className='text-white font-playfair font-bold text-[28px] md:text-[42px] uppercase tracking-tighter leading-none mb-6 drop-shadow-sm max-w-2xl'>
                {campaignName}
              </h1>
            )}

            {/* Action Call buttons */}
            <div className='flex items-center gap-4 w-full justify-center max-w-md'>
              <button className='w-[240px] text-[13px] text-white rounded-full font-host py-1 uppercase border hover:text-black hover:bg-white hover:border-black transition'>
                View Campaign
              </button>
              <button className='w-[240px] text-[13px] text-white rounded-full font-host py-1 uppercase border hover:text-black hover:bg-white hover:border-black transition'>
                Shop Now
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: INFINITE LOOPING IMAGE CAROUSEL                           */}
        {/* ========================================================================= */}
        <div className='w-full bg-white py-16 overflow-hidden'>
          
          <style>{`
            @keyframes infiniteScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-infinite-loop {
              display: flex;
              width: max-content;
              animation: infiniteScroll 25s linear infinite;
            }
          `}</style>

          {carouselImages.length > 0 ? (
            <div className='w-full overflow-hidden relative'>
              <div className='animate-infinite-loop gap-6 flex items-center'>
                
                {/* First Image Strip Track */}
                {carouselImages.map((imgUrl, index) => (
                  <div 
                    key={`set1-${index}`}
                    className='w-[55vw] bg-neutral-100 flex-shrink-0 overflow-hidden'
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Campaign Slide ${index + 1}`} 
                      className='w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04] ease-out'
                    />
                  </div>
                ))}

                {/* Duplicate Endless Continuity Strip Track */}
                {carouselImages.map((imgUrl, index) => (
                  <div 
                    key={`set2-${index}`}
                    className='w-[75vw] md:w-[45vw] lg:w-[35vw] aspect-[16/10] bg-neutral-100 flex-shrink-0 overflow-hidden'
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Campaign Slide Duplicate ${index + 1}`} 
                      className='w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04] ease-out'
                    />
                  </div>
                ))}

              </div>
            </div>
          ) : (
            <div className='w-full h-[20vh] flex items-center justify-center text-neutral-400 text-[11px] uppercase tracking-widest font-mono'>
              No campaign images synced to database
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* BRAND FOOTER SECTION                                                      */}
      {/* ========================================================================= */}
      <footer className='w-full bg-[#2a2a2a] text-neutral-300 font-host px-6 md:px-14 pt-16 pb-12 text-[11px] md:text-[12px] tracking-tight'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4 items-start'>
          
          {/* Left Column Spacer (Keeps clean right alignment layout context) */}
          <div className='hidden md:block md:col-span-5' />

          {/* ① LINKS COLUMN */}
          <div className='md:col-span-2 flex flex-col md:flex-row gap-4 md:gap-6'>
            <span className='font-bold uppercase tracking-wider text-white select-none whitespace-nowrap'>① LINKS</span>
            <div className='flex flex-col gap-2 font-light pl-1 md:pl-0 border-l border-neutral-600 md:border-0'>
              <a href="#events" className='hover:text-white transition'>Events</a>
              <a href="#products" className='hover:text-white transition'>Products</a>
              <a href="#collaborations" className='hover:text-white transition'>Collaborations</a>
              <a href="#stores" className='hover:text-white transition'>Stores</a>
            </div>
          </div>

          {/* ② FOLLOW COLUMN */}
          <div className='md:col-span-2 flex flex-col md:flex-row gap-4 md:gap-6'>
            <span className='font-bold uppercase tracking-wider text-white select-none whitespace-nowrap'>② FOLLOW</span>
            <div className='flex flex-col gap-2 font-light pl-1 md:pl-0 border-l border-neutral-600 md:border-0'>
              <a href="#facebook" className='hover:text-white transition'>Facebook</a>
              <a href="#instagram" className='hover:text-white transition'>Instagram</a>
              <a href="#youtube" className='hover:text-white transition'>Youtube</a>
              <a href="#tiktok" className='hover:text-white transition'>Tiktok</a>
            </div>
          </div>

          {/* ③ CONTACT COLUMN */}
          <div className='md:col-span-3 flex flex-col md:flex-row gap-4 md:gap-6'>
            <span className='font-bold uppercase tracking-wider text-white select-none whitespace-nowrap'>③ CONTACT</span>
            <div className='flex flex-col gap-4 font-light text-neutral-400'>
              <div>
                <p className='text-white font-medium'>Mike Nicklaus S. Ling</p>
                <p>Manila, Philippines 9000</p>
              </div>
              <div>
                <p className='hover:text-white transition select-all'>m.nicklausling@gmail.com</p>
                <p className='select-all'>+63 920 611 0289</p>
              </div>
            </div>
          </div>

        </div>

        {/* ④ NEWSLETTER SUBMISSION LAYER */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 mt-14 pt-8 border-t border-neutral-700/50 items-center'>
          <div className='hidden md:block md:col-span-5' />
          
          <div className='md:col-span-7 flex flex-col sm:flex-row sm:items-center gap-4 w-full'>
            <span className='font-bold uppercase tracking-wider text-white select-none whitespace-nowrap md:mr-4'>④ NEWSLETTER</span>
            <form onSubmit={(e) => e.preventDefault()} className='flex-1 flex items-center relative border-b border-neutral-500 pb-1.5 group focus-within:border-white transition-colors'>
              <span className='text-neutral-500 text-[10px] mr-2 select-none'>➔</span>
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL ADDRESS" 
                className='w-full bg-transparent border-none text-[11px] tracking-widest uppercase placeholder-neutral-500 text-white focus:outline-none'
              />
              <button type="submit" className='text-[10px] font-bold text-neutral-400 hover:text-white tracking-widest uppercase transition-colors ml-2'>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
          <div>
            © 2026 NICKLAUS LING
          </div>
      </footer>

    </div>
  )
}

export default Home;