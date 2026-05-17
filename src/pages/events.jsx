import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/navbar'

const Events = () => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track current active index on mobile view
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Controls the active background video
  const [bgVideo, setBgVideo] = useState('');
  const [defaultVideo, setDefaultVideo] = useState('');

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })
        .limit(4);

      if (!error && data && data.length > 0) {
        setEventsList(data);
        const initialVideo = data.find(e => e.video_url)?.video_url || '';
        setBgVideo(initialVideo);
        setDefaultVideo(initialVideo);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // AUTOMATIC TIMER FOR MOBILE: Switches slides every 4.5 seconds
  useEffect(() => {
    if (eventsList.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex === eventsList.length - 1 ? 0 : prevIndex + 1;
        
        // Sync background video with the upcoming slide index automatically
        if (eventsList[nextIndex]?.video_url) {
          setBgVideo(eventsList[nextIndex].video_url);
        }
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval); // Clean up timer on unmount
  }, [eventsList]);

  const formatDate = (dateString) => {
    return dateString 
      ? new Date(dateString).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '.')
      : '00.00.0000';
  };

  return (
    <div className='h-screen w-screen overflow-hidden relative flex flex-col'>
      <Navbar />

      {/* --- HERO / VIDEO FRAMEWORK (70% Height on Desktop, 100% on Mobile) --- */}
      <div className='w-full h-[80%] lg:h-[80%] bg-zinc-950 pt-24 lg:pt-32 font-host font-medium tracking-tighter px-6 lg:px-[47px] relative flex flex-col justify-between pb-12 z-10 flex-shrink-0'>
        
        {/* --- GLOBAL SMOOTH TRANSITION VIDEO CONTAINER --- */}
        <div className="absolute inset-0 w-full h-[70%] lg:h-full z-0 pointer-events-none overflow-hidden">
          {eventsList.map((event) => {
            if (!event.video_url) return null;
            const isActive = bgVideo === event.video_url;
            return (
              <video
                key={event.id}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-all duration-700 ease-in-out ${
                  isActive ? 'opacity-80 visible' : 'opacity-0 invisible'
                }`}
                src={event.video_url}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
        
        {/* Main Section Header */}
        <h1 className='text-white text-[45px] font-medium lg:text-[100px] leading-[0.85] lg:leading-[0.8] relative z-10 select-none pointer-events-none mt-4 lg:mt-0'>
          EVENTS<br/>🡢CALENDAR
        </h1>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: HORIZONTAL GRID LAYOUT                                      */}
        {/* ========================================================================= */}
        <div className='hidden lg:grid w-full grid-cols-4 gap-8 relative z-10 mt-auto pt-6 border-t border-white/20'>
          {eventsList.map((event) => (
            <div 
              key={event.id} 
              onMouseEnter={() => event.video_url && setBgVideo(event.video_url)}
              onMouseLeave={() => setBgVideo(defaultVideo)}
              className='flex flex-col gap-[7px] text-white font-host select-none group cursor-pointer'
            >
              <span className='text-[12px] text-neutral-400 tracking-normal'>
                {formatDate(event.date)}
              </span>
              <h3 className='text-[28px] font-bold uppercase tracking-tight leading-[1.1] group-hover:text-neutral-400 transition-colors whitespace-pre-line'>
                {event.title.includes('->') ? event.title.replace('->', '\n🡢') : event.title}
              </h3>
              <p className='text-[12px] font-medium font-poppins leading-snug tracking-normal line-clamp-2 max-w-[380px]'>
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW: ZERO-DEPENDENCY NATIVE CAROUSEL                             */}
        {/* ========================================================================= */}
        <div className='block lg:hidden w-full relative z-10 mt-auto mb-2 select-none text-white font-host'>
          
          {/* Slides Container wrapper */}
          <div className="relative w-full overflow-hidden min-h-[220px]">
            {eventsList.map((event, index) => {
              const isCurrent = activeIndex === index;
              return (
                <div
                  key={event.id}
                  className={`absolute inset-x-0 bottom-0 w-full flex flex-col justify-end pb-4 gap-[7px] transition-all duration-700 ease-in-out transform-gpu ${
                    isCurrent 
                      ? 'opacity-100 translate-x-0 pointer-events-auto' 
                      : 'opacity-0 translate-x-4 pointer-events-none'
                  }`}
                >
                  {/* Date Stamp */}
                  <span className='text-[11px] text-neutral-300 tracking-normal block'>
                    {formatDate(event.date)}
                  </span>
                  
                  {/* Title */}
                  <h3 className='text-[28px] font-bold uppercase tracking-tighter leading-[1] whitespace-pre-line max-w-[90%]'>
                    {event.title.includes('->') ? event.title.replace('->', '\n🡢') : event.title}
                  </h3>
                  
                  {/* Description Text */}
                  <p className='text-[12px] font-medium font-poppins leading-relaxed tracking-normal line-clamp-3 mb-6 max-w-[95%]'>
                    {event.description}
                  </p>

                  {/* Minimal Action Button */}
                  <button className='w-full text-[13px] bg-white text-black rounded-full font-host py-1 uppercase border hover:text-white hover:bg-black hover:border-white transition'>
                    LEARN MORE
                  </button>
                </div>
              );
            })}
          </div>

          {/* CUSTOM INDICATOR DOTS CONTAINER */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {eventsList.map((_, index) => {
              const isCurrent = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    if (eventsList[index]?.video_url) {
                      setBgVideo(eventsList[index].video_url);
                    }
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    isCurrent ? 'bg-white w-1.5 h-1.5' : 'bg-white/30 w-1.25 h-1.25'
                  }`}
                  style={{ width: isCurrent ? '6px' : '5px', height: isCurrent ? '6px' : '5px' }}
                />
              );
            })}
          </div>
        </div>

      </div>
      
      {/* Lower Page Canvas Area (Remaining 30% on desktop) */}
      <div className='hidden lg:block w-full flex-1 bg-white' />
    </div>
  )
}

export default Events;