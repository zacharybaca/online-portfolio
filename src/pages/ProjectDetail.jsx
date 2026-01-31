import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AUTOMATIC URL SWITCHING
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        // Find the specific project by ID
        const found = data.find((p) => p._id === id);
        setProject(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    // UPDATED: Use theme variable for Light Mode visibility
    return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading Project...</div>;
  }

  if (!project) {
    return (
      // UPDATED: Use theme variable for Light Mode visibility
      <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>
        <h2>Project not found</h2>
        <Link to="/" className="btn-link" style={{ display: 'inline-block', maxWidth: '100px' }}>
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <article className="portfolio-about">
      <nav className="nav">
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>

      <div className="inner-wrapper">
        <div className="project-info-box box">
          <h1 id="project-heading">{project.title}</h1>

          <div className="project-links" style={{ marginBottom: '1rem' }}>
            {project.repoLink && (
              <a
                href={project.repoLink}
                target="_blank"
                rel="noreferrer"
                className="btn-link"
                style={{ display: 'inline-block', marginRight: '10px' }}
              >
                GitHub Repo
              </a>
            )}

            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="btn-link"
                style={{ display: 'inline-block', marginRight: '10px' }}
              >
                Live Demo
              </a>
            )}
          </div>

          <p>{project.description}</p>
        </div>

        <div className="project-images box" style={{ background: 'transparent', border: 'none' }}>
          {project.imageUrls &&
            project.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${project.title} screenshot ${index + 1}`}
                className="project-img"
                style={{ marginBottom: '20px', width: '100%' }}
              />
            ))}
        </div>
      </div>
    </article>
  );
};

export default ProjectDetail;
