import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/navbar'

const Events = () => {
  const [eventsList, setEventsList] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgVideo, setBgVideo] = useState('');

  // Fetch events and posts from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch Events data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })
        .limit(4);

      if (!eventsError && eventsData?.length > 0) {
        setEventsList(eventsData);
        setBgVideo(eventsData[0].video_url || '');
      }

      // 2. Fetch Posts data
      const { data: postsData, error: postsError } = await supabase
        .from('post')
        .select('*')
        .order('created_at', { ascending: false });

      if (!postsError && postsData) {
        setPostsList(postsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // AUTOMATIC TIMER FOR MOBILE: Switches slides every 4.5 seconds
  useEffect(() => {
    if (eventsList.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev === eventsList.length - 1 ? 0 : prev + 1;
        setBgVideo(eventsList[next]?.video_url || '');
        return next;
      });
    }, 8500);

    return () => clearInterval(interval);
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
    <div className='min-h-screen w-full overflow-x-hidden overflow-y-auto flex flex-col bg-black'>
      <Navbar />

      {/* --- HERO / VIDEO FRAMEWORK --- */}
      <div className='w-full h-[80vh] bg-zinc-950 pt-24 lg:pt-32 font-host font-medium tracking-tighter px-6 lg:px-[47px] relative flex flex-col justify-between pb-12 z-10 flex-shrink-0'>

        {/* --- GLOBAL SMOOTH TRANSITION VIDEO CONTAINER --- */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          {eventsList.map((event) => {
            if (!event.video_url) return null;
            return (
              <video
                key={event.id}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-all duration-700 ease-in-out ${bgVideo === event.video_url ? 'opacity-50 visible' : 'opacity-0 invisible'
                  }`}
                src={event.video_url}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Main Section Header */}
        <div className='flex flex-col text-white text-[45px] lg:text-[100px] leading-[0.85] lg:leading-[0.8] relative z-10 select-none pointer-events-none mt-4 lg:mt-0'>
          <h1>EVENTS<br />🡢CALENDAR</h1>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: HORIZONTAL GRID LAYOUT                                      */}
        {/* ========================================================================= */}
        <div className='hidden lg:grid w-full grid-cols-4 gap-8 relative z-10 pt-6 border-t border-white/20'>
          {eventsList.map((event) => (
            <div
              key={event.id}
              onMouseEnter={() => event.video_url && setBgVideo(event.video_url)}
              className='flex flex-col gap-[7px] text-neutral-400 hover:text-white transition font-host select-none group cursor-pointer'
            >
              <span className='text-[12px] tracking-normal'>
                {formatDate(event.date)}
              </span>
              <h3 className='text-[28px] font-bold uppercase tracking-tight leading-[1.1] transition-colors whitespace-pre-line'>
                {event.title.replace('->', '\n🡢')}
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
          <div className="relative w-full overflow-hidden min-h-[250px]">
            {eventsList.map((event, index) => {
              const isCurrent = activeIndex === index;
              return (
                <div
                  key={event.id}
                  className={`absolute inset-x-0 bottom-0 w-full flex flex-col justify-end pb-4 gap-[7px] transition-all duration-700 ease-in-out transform-gpu ${isCurrent
                    ? 'opacity-100 translate-x-0 pointer-events-auto z-20 visible'
                    : 'opacity-0 translate-x-4 pointer-events-none z-0 hidden'
                    }`}
                >
                  <span className='text-[11px] text-neutral-300 tracking-normal block relative z-30'>
                    {formatDate(event.date)}
                  </span>

                  <h3 className='text-[28px] font-bold uppercase tracking-tighter leading-[1] whitespace-pre-line max-w-[90%]'>
                    {event.title.replace('->', '\n🡢')}
                  </h3>

                  <p className='text-[12px] font-medium font-poppins leading-relaxed tracking-normal line-clamp-3 mb-6 max-w-[95%]'>
                    {event.description}
                  </p>

                  <button className='w-full text-[13px] bg-white text-black rounded-full font-host py-1 uppercase border hover:text-white hover:bg-black hover:border-white transition'>
                    LEARN MORE
                  </button>
                </div>
              );
            })}
          </div>

          {/* CUSTOM INDICATOR DOTS CONTAINER */}
          <div className="flex justify-center items-center gap-2 mt-4 relative z-30">
            {eventsList.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setBgVideo(eventsList[index]?.video_url || '');
                }}
                className={`rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-white' : 'bg-white/30'
                  }`}
                style={{ width: activeIndex === index ? '6px' : '5px', height: activeIndex === index ? '6px' : '5px' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOWER PAGE CANVAS AREA: "THE POST" DATA FEED INTEGRATION                  */}
      {/* ========================================================================= */}
      <div className='flex flex-col gap-10 bg-white pt-[40px] lg:pt-[95px] font-poppins px-6 lg:px-[47px] pb-24 z-10'>
        <h1 className='text-[32px] lg:text-[48px] tracking-tighter font-medium text-black uppercase'>🡢 THE POST</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 w-full'>
          {postsList.map((post) => (
            <div key={post.id} className='flex flex-col w-full group cursor-pointer select-none'>

              {/* 1. SQUARE DIV WITH BACKGROUND IMAGE */}
              <div className='w-full aspect-square bg-neutral-100 overflow-hidden mb-[30px]'>
                {post.image ? (
                  <div
                    className='w-full h-full transition-transform duration-700 ease-out group-hover:scale-105'
                    style={{
                      backgroundImage: `url(${post.image})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-neutral-400 text-xs uppercase tracking-widest'>
                    No Image Available
                  </div>
                )}
              </div>

              {/* 2. TITLE SECOND */}
              <h3 className='text-[24px] mb-[14px] uppercase tracking-tighter leading-[1] text-black mb-[10px] whitespace-pre-line font-host group-hover:text-neutral-500 transition-colors'>
                {post.title ? post.title.replace('->', '\n🡢') : ''}
              </h3>

              {/* 3. DESCRIPTION THIRD */}
              {/* FIX: Added 'whitespace-pre-line' to make the UI honor database line breaks */}
              <p className='text-[12px] text-neutral-600 font-poppins tracking-tight line-clamp-3 leading-[1.4] max-w-full whitespace-pre-line'>
                {post.description}
              </p>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Events;