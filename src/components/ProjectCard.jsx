// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ data }) => {
  if (!data) return null;

  const thumbnail =
    data.imageUrls && data.imageUrls.length > 0
      ? data.imageUrls[0]
      : 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="cell">
      {/* 1. WRAP IMAGE IN LINK */}
      <Link to={`/project/${data._id}`}>
        <img
          src={thumbnail}
          alt={data.title || 'Project'}
          className="responsive-image"
          style={{ cursor: 'pointer' }} // Adds the "hand" icon on hover
        />
      </Link>

      <div className="projects-box">
        {/* 2. Title Link (Already existed) */}
        <Link to={`/project/${data._id}`}>
          <h5>{data.title}</h5>
        </Link>

        <div className="tags">
          {data.tags &&
            data.tags.map((tag, index) => (
              <span key={index} className="badge">
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
