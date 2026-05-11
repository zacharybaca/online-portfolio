import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';

const ProjectCarousel = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <>
      <h2 style={{ color: 'var(--text-primary)', margin: '2rem 0 1rem' }}>Featured Engineering</h2>
      <Carousel
        fade
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        {projects.map((project) => (
          <Carousel.Item key={project._id} interval={6000}>
            <Link to={`/project/${project._id}`}>
              <div style={{ height: '450px', background: '#000' }}>
                <img
                  className="d-block w-100"
                  src={project.imageUrls?.[0] || 'https://via.placeholder.com/900x450'}
                  alt={project.title}
                  style={{ objectFit: 'cover', height: '100%', opacity: '0.7' }}
                />
              </div>
            </Link>
            <Carousel.Caption
              style={{
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                width: '100%',
                left: '0',
                bottom: '0',
                padding: '40px 20px',
                textAlign: 'left',
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.8rem' }}>{project.title}</h3>
              <p style={{ color: '#ccc', maxWidth: '600px' }}>
                {project.description?.substring(0, 120)}...
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default ProjectCarousel;
