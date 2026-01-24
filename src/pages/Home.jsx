import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AUTOMATIC URL SWITCHING
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/projects`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('Data received is not an array:', data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <article className="portfolio-intro">
        <h1>Hi, I'm Zach.</h1>
        <p>
          I am a Software Engineer based in La Porte, IN, specializing in the MERN stack. Below are
          some of the projects I have built to demonstrate my skills in Full Stack Development.
        </p>
      </article>

      <div className="portfolio-project-thumbs">
        <div className="projects-box">
          <div className="grid">
            {/* FIX: Use theme variable instead of 'white' */}
            {loading && (
              <p style={{ color: 'var(--text-primary)', padding: '1rem' }}>Loading Projects...</p>
            )}

            {/* FIX: Use theme variable instead of 'white' */}
            {!loading && projects.length === 0 && (
              <p style={{ color: 'var(--text-primary)', padding: '1rem' }}>
                No projects found. (Check if your backend is running!)
              </p>
            )}

            {projects.map((project) => (
              <ProjectCard key={project._id} data={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
