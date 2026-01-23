// src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ data }) => {
  // HELPER: Grab the first image, or use a placeholder if empty
  const thumbnail = data.imageUrls && data.imageUrls.length > 0 
    ? data.imageUrls[0] 
    : "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="cell">
      {/* Use the thumbnail variable */}
      <img src={thumbnail} alt={data.title} className="responsive-image" />
      
      <div className="projects-box">
        <Link to={`/project/${data._id}`}> {/* Assuming MongoDB uses _id */}
          <h5>{data.title}</h5>
        </Link>
        {/* Render tags if they exist */}
        <div className="tags">
            {data.tags && data.tags.map((tag, index) => (
                <span key={index} className="badge">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
