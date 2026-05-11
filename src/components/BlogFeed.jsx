import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';

const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/blog`)
      .then((res) => res.json())
      .then((data) => setBlogPosts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleReadPost = (blog) => {
    setSelectedPost(blog);
    setModalShow(true);
  };

  return (
    <div className="portfolio-intro">
      <nav className="nav" style={{ marginBottom: '20px' }}>
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>

      <div
        className="blog-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {blogPosts.length > 0 ? (
          blogPosts.map((blog) => (
            <Card
              key={blog._id}
              className="blog-card"
              onClick={() => handleReadPost(blog)} // Entire card is now clickable
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <Card.Img
                variant="top"
                src={blog.coverImage || 'https://via.placeholder.com/300x180'}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title style={{ fontFamily: 'Modern' }}>{blog.title}</Card.Title>
                <Card.Text style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {blog.summary}
                </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  📅 {new Date(blog.createdAt).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  🏷️ {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'General'}
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button variant="outline-light" size="sm">
                  Read Article
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No published entries found.</p>
        )}
      </div>

      <BlogPost
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={selectedPost?.title}
        content={selectedPost?.content}
        timestamps={
          selectedPost?.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : ''
        }
      />

      <nav className="nav" style={{ marginTop: '40px' }}>
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>
    </div>
  );
};

export default BlogFeed;
