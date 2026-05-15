import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/navbar'
import arrow from '../assets/arrow-right.svg'

const Stores = () => {
  const [selectedRegion, setSelectedRegion] = useState('SK');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [availableCities, setAvailableCities] = useState([]);

  const regionFilters = [
    { id: 'SK', name: 'South Korea', img: 'https://gm-prd-resource.gentlemonster.com/store/170133562858988_Hannam_GM_image_02_.jpg' },
    { id: 'CN', name: 'China', img: 'https://gm-prd-resource.gentlemonster.com/store/171029634935631_HAUSNOWHERE_SH_1920x1080_2.jpg' },
    { id: 'JP', name: 'Japan', img: 'https://gm-prd-resource.gentlemonster.com/store/175568065828960_GINZA_FS_SPACE_IMAGE_1920x1080_2.jpg' },
    { id: 'US', name: 'United States', img: 'https://gm-prd-resource.gentlemonster.com/store/store_NY_pc_detail02.jpg' },
    { id: 'PH', name: 'Philippines', img: 'https://gm-prd-resource.gentlemonster.com/store/169750117942082_2.GM_MANILA_SPACE_2_KEY_1920x1080.jpg' },
    { id: 'HK', name: 'Hong Kong', img: 'https://gm-prd-resource.gentlemonster.com/store/171884777956640__1.jpg' },
  ];

  const activeFilter = regionFilters.find(f => f.id === selectedRegion);

  // FIX: Use a Set to prevent duplicates between main_image and sub_images
  const allStoreImages = selectedStore
    ? Array.from(new Set([selectedStore.main_image, ...(selectedStore.sub_images || [])])).filter(Boolean)
    : [];

  useEffect(() => {
    if (activeFilter && !selectedStore) setActiveImage(activeFilter.img);

    const fetchStores = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('country_id', selectedRegion);

      if (!error && data) {
        setStores(data);
        setAvailableCities([...new Set(data.map(s => s.city))].filter(Boolean));
        setSelectedCity('ALL');
      }
      setLoading(false);
    };
    fetchStores();
  }, [selectedRegion, selectedStore]);

  const filteredStores = selectedCity === 'ALL' ? stores : stores.filter(store => store.city === selectedCity);

  return (
    <div className='min-h-screen w-full flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden bg-white overflow-x-hidden'>
      <Navbar />

      {/* --- DESKTOP SIDEBAR --- */}
      <div
        className={`hidden lg:block transition-all duration-700 ease-in-out relative flex-shrink-0 
          ${selectedStore ? 'w-0 invisible opacity-0' : 'w-1/2 visible opacity-100'} h-full bg-neutral-100`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${activeImage})` }}
        />
        <div className="absolute inset-0 bg-black/[0.02]" />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className={`flex-1 flex flex-col transition-all duration-700 lg:h-full lg:overflow-hidden`}>

        {!selectedStore ? (
          <>
            {/* REGION FILTERS */}
            <div className="w-full flex justify-center pb-6 border-b border-neutral-100 bg-white pt-20 lg:pt-24">
              <div className="flex gap-6 overflow-x-auto no-scrollbar px-10 items-start pt-6 pb-6">
                {regionFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { 
                        setSelectedRegion(f.id); 
                        setActiveImage(f.img); 
                    }}
                    className="flex flex-col items-center flex-shrink-0 group outline-none"
                  >
                    <div
                      className={`w-[65px] h-[65px] lg:w-[70px] lg:h-[70px] rounded-full bg-neutral-200 bg-cover bg-center transition-all duration-500 
                        ${selectedRegion === f.id ? 'ring-1 ring-black ring-offset-4 scale-105' : 'opacity-60 group-hover:opacity-100'}`}
                      style={{ backgroundImage: `url(${f.img})` }}
                    />
                    <span className={`mt-4 text-[10px] uppercase tracking-tighter text-center leading-tight whitespace-pre-line 
                      ${selectedRegion === f.id ? 'font-bold text-black' : 'text-neutral-400 group-hover:text-black'}`}>
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* REGION / CITY LABEL */}
            <div className='px-6 lg:px-10 flex-shrink-0 flex items-center justify-between py-6 lg:pt-6 bg-white'>
              <h2 className='text-[12px] font-bold font-host uppercase tracking-tight'>
                {activeFilter?.name} / {selectedCity}
              </h2>
              <div className='relative'>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className='appearance-none bg-transparent pl-2 pr-6 text-[12px] font-bold font-host uppercase tracking-tight focus:outline-none cursor-pointer'
                >
                  <option value="ALL">CITY</option>
                  {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <span className='absolute right-0 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none'>▼</span>
              </div>
            </div>

            {/* STORE LIST */}
            <div className='flex flex-col lg:flex-1 lg:overflow-y-auto lg:no-scrollbar lg:px-12 pb-20 lg:pt-2 lg:gap-6'>
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => { setSelectedStore(store); window.scrollTo(0, 0); }}
                  onMouseEnter={() => setActiveImage(store.main_image)}
                  className='flex flex-col bg-white transition-all duration-300 cursor-pointer mb-24 lg:mb-0 lg:border lg:border-neutral-100 lg:rounded-2xl lg:p-4 lg:shadow-sm lg:hover:shadow-2xl lg:hover:border-neutral-200 group'
                >
                  <div className='w-full mb-8 lg:mb-6 overflow-hidden lg:rounded-xl lg:h-[400px]'>
                    <img
                      src={store.main_image}
                      alt={store.name}
                      className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                  </div>
                  <div className='px-6 lg:px-0 w-full'>
                    <h3 className='text-[24px] font-host uppercase tracking-tight leading-[1] mb-4'>
                      GENTLE MONSTER ✕<br />
                      <div className='flex items-center'>
                        <img src={arrow} alt="arrow" className="mr-2" />
                        {store.name}
                      </div>
                    </h3>
                    <div className='flex flex-col gap-2 font-host'>
                      <p className='text-[12px] text-black uppercase underline underline-offset-4 decoration-neutral-300'>
                        {store.location}
                      </p>
                      <p className='text-[12px] uppercase'>{store.contact_number}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* --- DETAIL VIEW --- */
          <div className="w-full h-full lg:flex lg:flex-row bg-white lg:pt-0 animate-in fade-in duration-500">

            {/* SCROLLABLE IMAGES CONTAINER */}
            <div className="w-full h-[40vh] lg:w-[100%] lg:h-full bg-white flex flex-row overflow-x-auto flex-nowrap gap-2 scroll-smooth scrollbar-hide">
              {allStoreImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="h-full w-full min-w-full lg:w-[100%] lg:min-w-[100%] bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
              ))}
            </div>

            {/* DETAILS CONTAINER */}
            <div className="w-full h-auto lg:w-[40%] lg:h-full bg-white lg:border-l border-gray-100 p-8 lg:p-12 lg:pt-32 flex flex-col lg:overflow-y-auto scrollbar-hide">
              <button
                onClick={() => setSelectedStore(null)}
                className='text-[11px] uppercase my-10 text-left hover:opacity-50 transition'
              >
                ← Back
              </button>

              <h3 className='text-[24px] lg:text-[32px] font-host uppercase tracking-tight leading-[1] mb-5'>
                GENTLE MONSTER<br />
                {selectedStore.name}
              </h3>

              <div className='flex flex-col gap-10 pt-4 pb-20'>
                <div>
                  <p className='text-[13px] font-host text-neutral-800 leading-[1.4] mb-6'>
                    {selectedStore.location}
                  </p>
                  <button className='w-full text-[13px] bg-black text-white rounded-full font-host py-1 uppercase mb-10 border hover:text-black hover:bg-white hover:border-black transition'>
                    GET DIRECTIONS
                  </button>
                </div>

                <hr className="border-t border-gray-300" />

                <div className='space-y-8 font-host'>
                  <div>
                    <h1 className='text-[12px] font-bold uppercase tracking-tight mb-2'>Store Hours</h1>
                    <p className="whitespace-pre-line text-[12px] text-gray-700 leading-relaxed font-light">{selectedStore.details}</p>
                  </div>

                  <hr className="border-t border-gray-300" />

                  <div>
                    <h1 className='text-[12px] font-bold uppercase tracking-tight mb-2'>Contact</h1>
                    <p className="text-[12px] text-gray-700 font-light">{selectedStore.contact_number}</p>
                  </div>

                  <hr className="border-t border-gray-300" />

                  <div>
                    <h1 className='text-[12px] font-bold uppercase tracking-tight mb-5'>In-Store Services</h1>
                    <div className='space-y-4 text-[12px] font-light text-gray-700'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-black uppercase text-[10px] mb-1'>Fitting Service</span>
                        <p>We offer a private fitting service to ensure each product fits you perfectly.</p>
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-bold text-black uppercase text-[10px] mb-1'>Simple Repair</span>
                        <p>We offer adjustment or component replacement services (such as nose pads, screws, etc).</p>
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-bold text-black uppercase text-[10px] mb-1'>Drop off Repairs</span>
                        <p>If your product needs a full repair, you can always drop it off at one of our stores.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stores