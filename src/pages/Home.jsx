// import React, { useEffect, useState } from 'react';
// import ProjectCard from '../components/ProjectCard';
// import { useTheme } from '../context/ThemeContext'; // <--- Import context

// const Home = () => {
//   const { isDarkMode } = useTheme(); // Get current mode
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- 1. DEFINE IMAGE OPTIONS ---
//   const darkOptions = [
//     {
//       name: 'Default (Tech Network)',
//       value:
//         'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
//     },
//     {
//       name: 'Moody Forest',
//       value: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2074',
//     },
//     {
//       name: 'Clean Concrete',
//       value: 'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?q=80&w=1994',
//     },
//     {
//       name: 'Circuit Board',
//       value: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070',
//     },
//     {
//       name: 'Deep Space',
//       value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022',
//     },
//   ];

//   const lightOptions = [
//     { name: 'Dandelion Seeds', value: '/images/dandelion.jpg' },
//     { name: 'Green Field', value: '/images/field.jpg' },
//     { name: 'Mario World', value: '/images/mario.jpg' },
//     { name: 'Open Scenery', value: '/images/scenery.jpg' },
//     { name: 'Grass Texture', value: '/images/grass.jpg' },
//   ];

//   // Pick the list based on mode
//   const currentOptions = isDarkMode ? darkOptions : lightOptions;

//   // --- 2. SMART STATE INITIALIZATION ---
//   const [selectedBg, setSelectedBg] = useState(() => {
//     // We check both keys so we can load the correct one immediately
//     const savedDark = localStorage.getItem('bg_dark');
//     const savedLight = localStorage.getItem('bg_light');

//     if (isDarkMode) {
//       return savedDark || darkOptions[0].value;
//     } else {
//       return savedLight || lightOptions[0].value;
//     }
//   });

//   // --- 3. HANDLE THEME SWITCHING ---
//   // When isDarkMode changes, we need to swap the image displayed
//   useEffect(() => {
//     const savedDark = localStorage.getItem('bg_dark') || darkOptions[0].value;
//     const savedLight = localStorage.getItem('bg_light') || lightOptions[0].value;

//     if (isDarkMode) {
//       setSelectedBg(savedDark);
//     } else {
//       setSelectedBg(savedLight);
//     }
//   }, [isDarkMode]);

//   // --- 4. APPLY BACKGROUND & SAVE ---
//   useEffect(() => {
//     // Clear styles first
//     document.body.style.background = '';
//     document.body.style.backgroundImage = '';

//     // Apply new image
//     document.body.style.setProperty('--bg-image', `url('${selectedBg}')`);

//     // Save to the correct key
//     if (isDarkMode) {
//       localStorage.setItem('bg_dark', selectedBg);
//     } else {
//       localStorage.setItem('bg_light', selectedBg);
//     }
//   }, [selectedBg, isDarkMode]);

//   // Fetch Projects logic (Unchanged)
//   useEffect(() => {
//     const apiUrl = import.meta.env.VITE_API_URL;
//     fetch(`${apiUrl}/api/projects`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setProjects(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   const completedProjects = projects.filter((p) => !p.status || p.status === 'completed');
//   const inProgressProjects = projects.filter((p) => p.status === 'in-progress');

//   if (loading)
//     return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading...</div>;

//   return (
//     <>
//       <article className="portfolio-intro">
//         <h1>Hi, I'm Zach.</h1>
//         <p>I am a Software Engineer based in La Porte, IN, specializing in the MERN stack.</p>

//         <div className="theme-selector" style={{ marginTop: '25px', display: 'inline-block' }}>
//           <label
//             style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
//           >
//             {/* Dynamic Label Icon */}
//             {isDarkMode ? '🎨 Dark Theme:' : '☀️ Light Theme:'}
//           </label>
//           <select
//             value={selectedBg}
//             onChange={(e) => setSelectedBg(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               borderRadius: '5px',
//               border: '1px solid var(--border-color)',
//               // In light mode, make the dropdown visible/readable
//               background: isDarkMode ? 'rgba(0,0,0,0.5)' : '#fff',
//               color: isDarkMode ? 'var(--text-primary)' : '#000',
//               cursor: 'pointer',
//               fontFamily: 'inherit',
//             }}
//           >
//             {/* Map over currentOptions (which swaps automatically) */}
//             {currentOptions.map((option, index) => (
//               <option
//                 key={index}
//                 value={option.value}
//                 style={{ background: isDarkMode ? '#333' : '#fff' }}
//               >
//                 {option.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </article>

//       <div className="portfolio-project-thumbs">
//         <div className="projects-box">
//           {completedProjects.length > 0 && (
//             <>
//               <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>Completed Projects</h2>
//               <div className="grid">
//                 {completedProjects.map((project) => (
//                   <ProjectCard key={project._id} data={project} />
//                 ))}
//               </div>
//             </>
//           )}

//           {inProgressProjects.length > 0 && (
//             <>
//               {completedProjects.length > 0 && (
//                 <hr style={{ margin: '3rem 0', borderColor: 'var(--border-color)' }} />
//               )}
//               <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>
//                 🚧 Currently In Progress
//               </h2>
//               <div className="grid">
//                 {inProgressProjects.map((project) => (
//                   <ProjectCard key={project._id} data={project} />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;

import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. DEFINE IMAGE OPTIONS ---
  const darkOptions = [
    {
      name: 'Default (Tech Network)',
      value:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    },
    {
      name: 'Moody Forest',
      value: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2074',
    },
    {
      name: 'Clean Concrete',
      value: 'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?q=80&w=1994',
    },
    {
      name: 'Circuit Board',
      value: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070',
    },
    {
      name: 'Deep Space',
      value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022',
    },
  ];

  const lightOptions = [
    {
      name: 'Dandelion Seeds',
      value: '/images/Backgrounds_Dandelion_seeds__background_Ubuntu_100911_24.jpg',
    },
    { name: 'Green Field', value: '/images/landscape_field_sky_1324896_2560x1600.jpg' },
    { name: 'Mario World', value: '/images/mario-background.jpg' },
    { name: 'Open Scenery', value: '/images/scenery.jpg' },
    { name: 'Grass Texture', value: '/images/texture_grass_field_83892_2560x1600.jpg' },
  ];

  const currentOptions = isDarkMode ? darkOptions : lightOptions;

  // --- 2. STATE ---
  // We track the previous mode to detect changes instantly
  const [prevMode, setPrevMode] = useState(isDarkMode);

  const [selectedBg, setSelectedBg] = useState(() => {
    const savedDark = localStorage.getItem('bg_dark');
    const savedLight = localStorage.getItem('bg_light');
    if (isDarkMode) return savedDark || darkOptions[0].value;
    return savedLight || lightOptions[0].value;
  });

  // --- 3. THE FIX: ADJUST STATE DURING RENDER (No Effect Needed) ---
  if (isDarkMode !== prevMode) {
    setPrevMode(isDarkMode); // Sync state
    const savedDark = localStorage.getItem('bg_dark') || darkOptions[0].value;
    const savedLight = localStorage.getItem('bg_light') || lightOptions[0].value;
    setSelectedBg(isDarkMode ? savedDark : savedLight);
  }

  // --- 4. EFFECTS ---
  // This effect ONLY handles applying the CSS to the body.
  // It does NOT update React state, so it's safe.
  useEffect(() => {
    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.body.style.setProperty('--bg-image', `url('${selectedBg}')`);

    if (isDarkMode) localStorage.setItem('bg_dark', selectedBg);
    else localStorage.setItem('bg_light', selectedBg);
  }, [selectedBg, isDarkMode]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const completedProjects = projects.filter((p) => !p.status || p.status === 'completed');
  const inProgressProjects = projects.filter((p) => p.status === 'in-progress');

  if (loading)
    return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading...</div>;

  return (
    <>
      <article className="portfolio-intro">
        <h1>Hi, I'm Zach.</h1>
        <p>I am a Software Engineer based in La Porte, IN, specializing in the MERN stack.</p>

        <div className="theme-selector" style={{ marginTop: '25px', display: 'inline-block' }}>
          <label
            style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
          >
            {isDarkMode ? '🎨 Dark Theme:' : '☀️ Light Theme:'}
          </label>
          <select
            value={selectedBg}
            onChange={(e) => setSelectedBg(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: '1px solid var(--border-color)',
              background: isDarkMode ? 'rgba(0,0,0,0.5)' : '#fff',
              color: isDarkMode ? 'var(--text-primary)' : '#000',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {currentOptions.map((option, index) => (
              <option
                key={index}
                value={option.value}
                style={{ background: isDarkMode ? '#333' : '#fff' }}
              >
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </article>

      <div className="portfolio-project-thumbs">
        <div className="projects-box">
          {/* === SECTION 1: COMPLETED (CAROUSEL) === */}
          {completedProjects.length > 0 && (
            <>
              <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>Completed Projects</h2>

              <Carousel
                fade
                style={{
                  maxWidth: '800px',
                  margin: '0 auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                {completedProjects.map((project) => (
                  <Carousel.Item key={project._id} interval={5000}>
                    <Link to={`/project/${project._id}`}>
                      <div
                        style={{
                          height: '400px',
                          background: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          className="d-block w-100"
                          src={
                            project.imageUrls && project.imageUrls.length > 0
                              ? project.imageUrls[0] // <--- REMOVED THE API URL PREFIX
                              : 'https://via.placeholder.com/800x400'
                          }
                          alt={project.title}
                          style={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            opacity: '0.9',
                          }}
                        />
                      </div>
                    </Link>
                    <Carousel.Caption
                      style={{
                        background: 'rgba(0,0,0,0.7)',
                        padding: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      <h3 style={{ color: '#fff', textShadow: '1px 1px 2px black' }}>
                        {project.title}
                      </h3>
                      <p style={{ color: '#ddd' }}>
                        {project.description ? project.description.substring(0, 80) + '...' : ''}
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </>
          )}

          {/* === SECTION 2: IN PROGRESS (GRID) === */}
          {inProgressProjects.length > 0 && (
            <>
              <hr style={{ margin: '3rem 0', borderColor: 'var(--border-color)' }} />
              <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>
                🚧 Currently In Progress
              </h2>

              <div className="grid">
                {inProgressProjects.map((project) => (
                  <ProjectCard key={project._id} data={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
