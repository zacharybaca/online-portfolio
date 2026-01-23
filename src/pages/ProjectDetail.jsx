// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Fetch specific project by ID
    // Note: You might need to add a "Get Single Project" route to your backend
    // Or just filter from the full list if you are caching it.
    // For now, let's assume you fetch all and find one (easiest for small portfolios)
    fetch('https://your-app-name.onrender.com/api/projects')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setProject(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!project) return <div style={{color:'white', padding:'2rem'}}>Loading...</div>;

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
          
          <div className="project-links" style={{marginBottom: '1rem'}}>
             {project.repoLink && <a href={project.repoLink} target="_blank" className="btn-link" style={{display:'inline-block', marginRight:'10px'}}>GitHub Repo</a>}
             {project.demoLink && <a href={project.demoLink} target="_blank" className="btn-link" style={{display:'inline-block'}}>Live Demo</a>}
          </div>

          <p>{project.description}</p>
        </div>

        {/* GALLERY SECTION */}
        <div className="project-images box" style={{background: 'transparent', border:'none'}}>
           {project.imageUrls && project.imageUrls.map((url, index) => (
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
