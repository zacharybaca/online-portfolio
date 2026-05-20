import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ data }) => {
  if (!data) return null;
  
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  
  const resolveImageUrl = (path) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Preview';
    if (path.startsWith('http')) return path;
    return `${apiUrl}/${path.replace(/^\//, '')}`;
  };

  const thumbnail = resolveImageUrl(data.imageUrls?.[0]);

  return (
    <div
      className="cell"
      style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}
    >
      <Link to={`/project/${data._id}`}>
        <img
          src={thumbnail}
          alt={data.title}
          className="responsive-image"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      </Link>
      <div className="projects-box" style={{ padding: '15px' }}>
        <Link to={`/project/${data._id}`}>
          <h5 style={{ marginBottom: '10px' }}>{data.title}</h5>
        </Link>
        <div
          className="tags"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}
        >
          {data.tags?.map((tag, i) => (
            <span key={i} className="badge" style={{ fontSize: '0.7rem' }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {data.repoLink && (
            <a
              href={data.repoLink}
              target="_blank"
              rel="noreferrer"
              className="badge"
              style={{ background: '#333', color: 'white', padding: '5px 10px' }}
            >
              Repo
            </a>
          )}
          {data.demoLink && (
            <a
              href={data.demoLink}
              target="_blank"
              rel="noreferrer"
              className="badge"
              style={{ background: '#28a745', color: 'white', padding: '5px 10px' }}
            >
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
