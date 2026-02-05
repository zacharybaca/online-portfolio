import { useEffect, useState } from 'react'; // Added useState back
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

// REMOVED props. Now it manages its own data.
const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]); // Restored local state

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        setBlogPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching blog posts', error);
      });
  }, []);

  return (
    <div
      className="blog-grid"
      style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <nav className="nav">
          <Link to="/">
            <span>&larr;</span> Back
          </Link>
        </nav>

      {blogPosts.length > 0 ? (
        blogPosts.map((blog) => (
          <Card key={blog._id} className="blog-card" style={{ width: '18rem' }}>
            <Card.Img
              variant="top"
              src={blog.coverImage || 'https://via.placeholder.com/150'}
              style={{ height: '180px', objectFit: 'cover' }}
            />

            <Card.Body>
              <Card.Title>{blog.title}</Card.Title>
              <Card.Text>{blog.summary}</Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
              <ListGroup.Item>📅 {new Date(blog.createdAt).toLocaleDateString()}</ListGroup.Item>
              <ListGroup.Item>
                🏷️ {blog.tags.length > 0 ? blog.tags.join(', ') : 'No Tags'}
              </ListGroup.Item>
            </ListGroup>

            <Card.Body>
              <Card.Link as={Link} to={`/blog/${blog.slug}`}>
                Read Post
              </Card.Link>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No Posts Available</p>
      )}

      <nav className="nav">
          <Link to="/">
            <span>&larr;</span> Back
          </Link>
        </nav>

    </div>
  );
};

export default BlogFeed;
