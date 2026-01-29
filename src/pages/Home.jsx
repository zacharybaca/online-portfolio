import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to the "Tech Network" image
  const [selectedBg, setSelectedBg] = useState(
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
  );

  const backgroundOptions = [
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

  // Effect to Apply Background
  useEffect(() => {
    // 1. CLEANUP: Remove hardcoded styles to let CSS classes work
    document.body.style.background = '';
    document.body.style.backgroundImage = '';

    // 2. APPLY NEW: Set variable for CSS to use
    document.body.style.setProperty('--bg-image', `url('${selectedBg}')`);
  }, [selectedBg]);

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

        {/* --- ADDED CLASS NAME BELOW: "theme-selector" --- */}
        <div className="theme-selector" style={{ marginTop: '25px', display: 'inline-block' }}>
          <label
            style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
          >
            🎨 Customize Theme:
          </label>
          <select
            value={selectedBg}
            onChange={(e) => setSelectedBg(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.5)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {backgroundOptions.map((option, index) => (
              <option key={index} value={option.value} style={{ background: '#333' }}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </article>

      <div className="portfolio-project-thumbs">
        <div className="projects-box">
          {completedProjects.length > 0 && (
            <>
              <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>Completed Projects</h2>
              <div className="grid">
                {completedProjects.map((project) => (
                  <ProjectCard key={project._id} data={project} />
                ))}
              </div>
            </>
          )}

          {inProgressProjects.length > 0 && (
            <>
              {completedProjects.length > 0 && (
                <hr style={{ margin: '3rem 0', borderColor: 'var(--border-color)' }} />
              )}

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
