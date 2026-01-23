import React from "react";
import projectsData from "../data.json";
import ProjectCard from "../components/ProjectCard"; // Import the new component

const Home = () => {
  return (
    <>
      <article className="portfolio-intro">
        <div className="logo-container">
          <img
            className="logo-image"
            src="/images/logo.png"
            alt="resume-logo"
          />
          <img
            className="logo-image"
            src="/images/brand-logo-text.png"
            alt="resume-logo-text"
          />
        </div>

        <h1 className="slogan-header">
          Bringing Your Vision to Life, Pixel by Pixel....
        </h1>
        <p className="intro-para">
          Welcome to My Online Portfolio! Explore a selection of my recent
          projects.
        </p>
      </article>

      <article className="portfolio-project-thumbs">
        {/* The 'grid' class here arranges the ProjectCards */}
        <div className="projects-box box grid">
          {/* Map over the data and pass props to ProjectCard */}
          {projectsData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </article>
    </>
  );
};

export default Home;
