import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import data from '../data.json';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = data.projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <Navigate to="/not-found" />;
  }

  return (
    <>
      {/* Top Navigation */}
      <nav className="nav">
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>

      <article className="portfolio-projects">
        <div className="inner-wrapper flex-row-wrap two-col">

          {/* Left Column: Title and Description */}
          <div className="project-info-box box">
            <h1>{project.project_name}</h1>
            <p>{project.description}</p>
          </div>

          {/* Right Column: Technologies and Links */}
          <div className="project-tech-links-box box">
            <h6>Technologies</h6>
            <ul className="tech-stack">
              {project.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>

            <a
              href={project.live_link}
              target="_blank"
              rel="noreferrer"
              className="btn-link"
            >
              Live Demo
            </a>
            <a
              href={project.github_link}
              target="_blank"
              rel="noreferrer"
              className="btn-link"
            >
              GitHub Repo
            </a>
          </div>

          {/* Bottom Area: Images */}
          <div className="project-img-box box">
            {project.image_urls.map((img, index) => (
              <img
                key={index}
                className="project-img"
                src={img}
                alt={`${project.project_name} screenshot`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="nav">
          <Link to="/">
            <span>&larr;</span> Back
          </Link>
        </nav>
      </article>
    </>
  );
};

export default ProjectDetail;
