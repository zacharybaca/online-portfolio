import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="cell">
      <Link to={`/project/${project.id}`}>
        {/* We use the first image in the array as the thumbnail */}
        <img
          className="thumbnail"
          src={project.image_urls[0]}
          alt={project.project_name}
        />
        <h5 style={{ textAlign: 'center', marginTop: '10px' }}>
          {project.project_name}
        </h5>
      </Link>
    </div>
  );
};

export default ProjectCard;
