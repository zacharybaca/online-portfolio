import ProjectCard from './ProjectCard';

const ProjectList = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div style={{ marginTop: '4rem' }}>
      <hr style={{ borderColor: 'var(--border-color)', marginBottom: '3rem' }} />
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Active Development</h2>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px',
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project._id} data={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
