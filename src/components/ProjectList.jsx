import ProjectCard from './ProjectCard';


const ProjectList = ({ projects }) => {

    return (
       projects.length > 0 && (
            <>
              <hr style={{ margin: '3rem 0', borderColor: 'var(--border-color)' }} />
              <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>
                🚧 Currently In Progress
              </h2>

              <div className="grid">
                {projects.map((project) => (
                  <ProjectCard key={project._id} data={project} />
                ))}
              </div>
            </>
    )
}

export default ProjectList;
