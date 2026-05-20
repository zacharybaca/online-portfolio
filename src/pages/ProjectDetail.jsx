import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${apiUrl}/${path.replace(/^\//, '')}`;
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.find((p) => p._id === id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, apiUrl]);

  if (loading)
    return (
      <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Initializing System...</div>
    );
  if (!project)
    return (
      <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>
        <h2>Project Not Found</h2>
        <Link to="/" className="btn-link">
          Return Home
        </Link>
      </div>
    );

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
          <div className="tags" style={{ marginBottom: '1.5rem' }}>
            {project.tags &&
              project.tags.map((tag, i) => (
                <span key={i} className="badge">
                  {tag}
                </span>
              ))}
          </div>

          <div className="project-links" style={{ marginBottom: '2rem' }}>
            {project.repoLink && (
              <a
                href={project.repoLink}
                target="_blank"
                rel="noreferrer"
                className="btn-link"
                style={{ display: 'inline-block', marginRight: '10px' }}
              >
                Source Code
              </a>
            )}
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="btn-link"
                style={{ display: 'inline-block' }}
              >
                Live Demo
              </a>
            )}
          </div>

          <div className="case-study-section">
            <h3>Overview</h3>
            <p>{project.description}</p>

            {project.challenge && (
              <>
                <h3 style={{ marginTop: '2rem', color: '#ff6b6b' }}>Technical Challenge</h3>
                <p>{project.challenge}</p>
              </>
            )}

            {project.solution && (
              <>
                <h3 style={{ marginTop: '2rem', color: '#51cf66' }}>Solution & Implementation</h3>
                <p>{project.solution}</p>
              </>
            )}
          </div>
        </div>

        <div className="project-images box" style={{ background: 'transparent', border: 'none' }}>
          {project.imageUrls &&
            project.imageUrls.map((url, i) => (
              <img key={i} src={resolveImageUrl(url)} alt="Screenshot" className="project-img" />
            ))}
        </div>
      </div>
    </article>
  );
};

export default ProjectDetail;
