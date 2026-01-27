import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Filter projects into two categories
  // Note: We check if status is MISSING (old projects) and treat them as completed
  const completedProjects = projects.filter((p) => !p.status || p.status === 'completed');
  const inProgressProjects = projects.filter((p) => p.status === 'in-progress');

  if (loading)
    return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading...</div>;

  return (
    <>
      <article className="portfolio-intro">
        <h1>Hi, I'm Zach.</h1>
        <p>I am a Software Engineer based in La Porte, IN, specializing in the MERN stack.</p>
      </article>

      <div className="portfolio-project-thumbs">
        <div className="projects-box">
          {/* SECTION 1: COMPLETED PROJECTS */}
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

          {/* SECTION 2: IN PROGRESS */}
          {inProgressProjects.length > 0 && (
            <>
              {/* Add a separator line if we have both sections */}
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
