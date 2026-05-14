import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/navbar'

const Stores = () => {
  const [selectedRegion, setSelectedRegion] = useState('SK');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  
  // Track the current active image for the left panel
  const [activeImage, setActiveImage] = useState('');

  const [selectedCity, setSelectedCity] = useState('ALL');
  const [availableCities, setAvailableCities] = useState([]);

  const regionFilters = [
    { id: 'SK', name: 'SOUTH\nKOREA', img: 'https://gm-prd-resource.gentlemonster.com/store/170133562858988_Hannam_GM_image_02_.jpg' },
    { id: 'CN', name: 'CHINA,\nMAINLAND', img: 'https://gm-prd-resource.gentlemonster.com/store/171029634935631_HAUSNOWHERE_SH_1920x1080_2.jpg' },
    { id: 'JP', name: 'JAPAN', img: 'https://gm-prd-resource.gentlemonster.com/store/175568065828960_GINZA_FS_SPACE_IMAGE_1920x1080_2.jpg' },
    { id: 'US', name: 'UNITED\nSTATES', img: 'https://gm-prd-resource.gentlemonster.com/store/store_NY_pc_detail02.jpg' },
    { id: 'PH', name: 'PHILIPPINES', img: 'https://gm-prd-resource.gentlemonster.com/store/169750117942082_2.GM_MANILA_SPACE_2_KEY_1920x1080.jpg' },
    { id: 'HK', name: 'HONG KONG', img: 'https://gm-prd-resource.gentlemonster.com/store/171884777956640__1.jpg' },
  ];

  const activeFilter = regionFilters.find(f => f.id === selectedRegion);

  // Initialize/Update image when region changes
  useEffect(() => {
    if (activeFilter) {
      setActiveImage(activeFilter.img);
    }

    const fetchStores = async () => {
      setLoading(true);
      setStores([]);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('country_id', selectedRegion);

      if (!error && data) {
        setStores(data);
        const cities = [...new Set(data.map(s => s.city))].filter(Boolean);
        setAvailableCities(cities);
        setSelectedCity('ALL');
      }
      setLoading(false);
    };
    fetchStores();
  }, [selectedRegion]);

  const filteredStores = selectedCity === 'ALL'
    ? stores
    : stores.filter(store => store.city === selectedCity);

  return (
    <div className='h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-white'>
      <Navbar />

      {/* --- LEFT SECTION --- */}
      <div
        className={`transition-all duration-700 ease-in-out relative flex-shrink-0 overflow-hidden
          ${selectedStore ? 'w-full lg:w-[65%]' : 'w-full lg:w-1/2'} h-[35vh] lg:h-full bg-neutral-200`}
        style={{
          // We use activeImage which is updated by hover but NOT reset by unhover
          backgroundImage: `url(${selectedStore?.main_image || activeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Applying your fast ease-out duration for the crossfade
          transition: 'background-image 0.3s ease-out, width 0.7s ease-in-out'
        }}
      >
        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className={`transition-all duration-700 ease-in-out bg-white h-full max-h-screen flex flex-col pt-4 lg:pt-20 overflow-hidden
        ${selectedStore ? 'w-full lg:w-[35%]' : 'w-full lg:w-1/2'}`}>

        {!selectedStore ? (
          <>
            {/* COUNTRY CIRCLES */}
            <div className="w-full flex-shrink-0 flex justify-center py-6">
              <div className="flex gap-6 overflow-x-auto no-scrollbar px-10 items-start pt-4 pb-4">
                {regionFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedRegion(f.id);
                      // On region change, we reset the active image to that region's cover
                      setActiveImage(f.img);
                    }}
                    className="flex flex-col items-center flex-shrink-0 group outline-none"
                  >
                    <div
                      className={`w-[65px] h-[65px] lg:w-[70px] lg:h-[70px] rounded-full bg-cover bg-center transition-all duration-500 ${selectedRegion === f.id ? 'ring-1 ring-black ring-offset-4 scale-110' : 'opacity-40 group-hover:opacity-100'
                        }`}
                      style={{ backgroundImage: `url(${f.img})` }}
                    />
                    <span className={`mt-4 text-[10px] uppercase tracking-tighter text-center leading-tight font-host whitespace-pre-line ${selectedRegion === f.id ? 'font-bold text-black' : 'text-neutral-400'
                      }`}>
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CITY FILTER */}
            <div className='px-6 lg:px-12 flex-shrink-0 flex items-center justify-between py-4 border-t border-neutral-100'>
              <h2 className='font-host text-[12px] font-medium uppercase tracking-tight'>
                {activeFilter?.name.replace('\n', ' ')} / {selectedCity}
              </h2>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className='bg-transparent border border-neutral-200 text-[10px] uppercase px-2 py-1 rounded-sm focus:outline-none cursor-pointer'
              >
                <option value="ALL">View All</option>
                {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            {/* SCROLLABLE LIST */}
            <div className='flex-1 overflow-y-auto no-scrollbar px-6 lg:px-12 pb-32 space-y-4 pt-4'>
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  // Logic: Set the active image on hover, but DO NOT reset on mouse leave
                  onMouseEnter={() => setActiveImage(store.main_image)}
                  className='p-6 bg-white border border-neutral-50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group'
                >
                  <h3 className='font-medium text-[15px] uppercase mb-2 group-hover:text-neutral-500 transition-colors'>
                    {store.name}
                  </h3>
                  <p className='text-[11px] text-neutral-400 uppercase tracking-tight leading-tight'>
                    {store.location}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* DETAIL VIEW */
          <div className='flex-1 overflow-y-auto no-scrollbar p-8 lg:p-14 bg-white'>
            <button
              onClick={() => setSelectedStore(null)}
              className='flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-12 hover:text-black transition-colors'
            >
              ← Back
            </button>
            <h1 className='text-[22px] lg:text-[26px] font-medium uppercase mb-10 tracking-tight leading-tight'>
              {selectedStore.name}
            </h1>
            <div className='mb-14 text-[14px] uppercase text-neutral-800 leading-relaxed'>
              {selectedStore.location}
            </div>
            <button className='w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.25em] rounded-full hover:opacity-80 transition-opacity'>
              Get Directions
            </button>
            <div className='border-t border-neutral-100 mt-10 pt-8'>
              <h4 className='text-[11px] font-bold uppercase tracking-[0.2em] mb-6'>Store Hours</h4>
              <p className='text-[11px] uppercase text-neutral-500 leading-[2.2] whitespace-pre-line'>
                {selectedStore.details}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stores