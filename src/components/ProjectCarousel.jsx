import Carousel from 'react-bootstrap/Carousel';

const ProjectCarousel = ({ projects }) => {
  return (
    projects.length > 0 && (
      <>
        <h2 style={{ color: 'var(--text-primary)', margin: '1rem 0' }}>Completed Projects</h2>

        <Carousel
          fade
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {projects.map((project) => (
            <Carousel.Item key={project._id} interval={5000}>
              <Link to={`/project/${project._id}`}>
                <div
                  style={{
                    height: '400px',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    className="d-block w-100"
                    src={
                      project.imageUrls && project.imageUrls.length > 0
                        ? project.imageUrls[0]
                        : 'https://via.placeholder.com/800x400'
                    }
                    alt={project.title}
                    style={{
                      objectFit: 'cover',
                      height: '100%',
                      width: '100%',
                      opacity: '0.9',
                    }}
                  />
                </div>
              </Link>
              <Carousel.Caption
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                <h3 style={{ color: '#fff', textShadow: '1px 1px 2px black' }}>{project.title}</h3>
                <p style={{ color: '#ddd' }}>
                  {project.description ? project.description.substring(0, 80) + '...' : ''}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </>
    )
  );
};

export default ProjectCarousel;
